# -*- coding: utf-8 -*-
"""Locución latido a latido, con prosodia variable y timings exactos.

Dos problemas del método anterior, y cómo se resuelven aquí:

1. RITMO ROBÓTICO. Antes se sintetizaba un bloque largo con un `rate` fijo, y
   edge-tts entrega una cadencia plana e idéntica frase tras frase. Aquí cada
   latido lleva su propio `rate` y `pitch` según su función en la conversación
   —una reacción va más viva, una cifra más lenta, la complicidad más grave— y
   además un jitter determinista por índice, para que dos latidos seguidos del
   mismo tono no salgan calcados. Las pausas entre turnos también varían: cortas
   en el ida y vuelta, largas al cambiar de tema.

2. SINCRONÍA. Al sintetizar latido a latido se conoce la duración EXACTA de cada
   frase, así que el plano puede durar exactamente lo que dura la frase que lo
   nombra. No se estima: se mide.

El montaje se hace en PCM crudo, no concatenando mp3: así los silencios miden lo
que dicen medir, sin el relleno que mete el codificador en cada corte.

  python narrar_beats.py guion_catastro catastro
"""
import asyncio, importlib, io, json, os, subprocess, sys, tempfile

# La consola de Windows es cp1252 y el guion está lleno de acentos y flechas.
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import edge_tts

AQUI = os.path.dirname(os.path.abspath(__file__))
PUBLICO = r"C:\Users\luis.monsalve\Documents\GitHub\coipo_notebooklm\video\public"

VOCES = {'l': 'es-CL-LorenzoNeural', 'c': 'es-CL-CatalinaNeural'}

# Base por voz: Catalina lee un punto más rápido que Lorenzo por naturaleza.
BASE = {'l': -1, 'c': +1}

# Aceleración global, pedida por Luis tras oír la muestra C. Se suma a TODOS
# los tonos, incluido el del énfasis: así el trozo marcado sigue estando 16
# puntos por debajo del resto y el contraste se conserva. Si sólo se acelerara
# la base, el énfasis dejaría de notarse.
ACELERACION = +12   # calibrado: da 10,0 % mas rapido medido, no +10 teorico

# Cada tono es una FUNCIÓN en la conversación, no un adorno.
TONO = {
    'normal': dict(rate=-2,  pitch=0),
    'lento':  dict(rate=-16, pitch=-3),   # cifras, remates, la advertencia
    'vivo':   dict(rate=+8,  pitch=+4),   # reacciones y preguntas cortas
    'suave':  dict(rate=-9,  pitch=-4),   # complicidad
}

# Jitter determinista: rompe la identidad entre latidos consecutivos del mismo
# tono sin volverse aleatorio (el mismo guion da siempre el mismo audio).
JITTER_RATE = [0, +4, -2, +2, -4, +3, -1, -3]
JITTER_PITCH = [0, -1, +1, 0, +1, -1, 0, +1]

# ---------------------------------------------------------------- énfasis
# edge-tts no admite <emphasis>: Microsoft sólo deja UN <prosody> por locución.
# La vía documentada es trocear la frase y dar su propia prosodia a cada trozo.
# En el guion el énfasis se marca con *asteriscos*.
#
# El trozo enfatizado va más lento, un poco más agudo y más fuerte —volume, que
# hasta ahora no se usaba— porque así es como un hablante real destaca algo:
# no sólo sube el tono, también se demora y aprieta.
ENFASIS = dict(rate=-16, pitch=+2, vol=+14)
COSTURA = 0.055        # micro-pausa entre trozos, en el punto donde la voz ya respiraría


def trozos(texto):
    """Parte en (texto, ¿enfatizado?) por los marcadores *…*.

    Un trozo sin letras ni cifras —el «¿» que queda suelto al marcar
    «¿*Veinticinco por ciento*?»— hace que edge-tts devuelva CERO audio, sin
    error hasta que revienta el guardado. Esos trozos se pegan al vecino.
    """
    crudos = [(t, i % 2 == 1) for i, t in enumerate(texto.split('*')) if t]
    if not crudos:
        return [(texto, False)]
    fuera = []
    for t, marcado in crudos:
        tiene_voz = any(c.isalnum() for c in t)
        if not tiene_voz and fuera:
            fuera[-1] = (fuera[-1][0] + t, fuera[-1][1])
        elif not tiene_voz:
            fuera.append((t, marcado))          # se fusiona con el siguiente
        elif fuera and not any(c.isalnum() for c in fuera[-1][0]):
            fuera[-1] = (fuera[-1][0] + t, marcado)
        else:
            fuera.append((t, marcado))
    return fuera


HZ = 24000
PORTADILLA = 10.0          # los 10 s de Forestín, intocables


def pcm(ruta):
    """Decodifica a PCM 16 bits mono, para poder pegar con precisión de muestra."""
    return subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', ruta, '-ar', str(HZ), '-ac', '1',
         '-f', 's16le', '-'], stdout=subprocess.PIPE, check=True).stdout


def silencio(segundos):
    return b'\x00\x00' * int(round(segundos * HZ))

def recortar(datos, guarda=0.090, umbral=0.006):
    """Quita el silencio propio de edge-tts al principio y al final.

    MEDIDO: sin esto, una pausa de 0,15 s del guion salía a ~0,75 s en el audio,
    porque cada frase sintetizada trae unos 0,3 s de aire en cada extremo. El
    ida y vuelta rápido que da vida a la conversación no existía.
    """
    import array
    m = array.array('h')
    m.frombytes(datos)
    if not m:
        return datos
    pico = max(abs(x) for x in m) or 1
    lim = pico * umbral
    ini, fin = 0, len(m) - 1
    while ini < len(m) and abs(m[ini]) < lim:
        ini += 1
    while fin > ini and abs(m[fin]) < lim:
        fin -= 1
    g = int(guarda * HZ)
    ini = max(0, ini - g)
    fin = min(len(m) - 1, fin + g)
    return m[ini:fin + 1].tobytes()




async def principal(modulo, nombre):
    guion = importlib.import_module(modulo).GUION
    tmp = tempfile.mkdtemp(prefix='beats-')
    trozos, meta, t = [], [], PORTADILLA

    for i, b in enumerate(guion):
        v = b['v']
        cfg = TONO[b.get('tono', 'normal')]
        rate = cfg['rate'] + BASE[v] + ACELERACION + JITTER_RATE[i % len(JITTER_RATE)]
        pitch = cfg['pitch'] + JITTER_PITCH[i % len(JITTER_PITCH)]

        partes = []
        for j, (txt, marcado) in enumerate(trozos(b['t'])):
            r = rate + (ENFASIS['rate'] if marcado else 0)
            pi = pitch + (ENFASIS['pitch'] if marcado else 0)
            vol = ENFASIS['vol'] if marcado else 0
            crudo = os.path.join(tmp, '%03d_%d.mp3' % (i, j))
            await edge_tts.Communicate(
                txt.strip(), VOCES[v], rate='%+d%%' % r,
                pitch='%+dHz' % pi, volume='%+d%%' % vol).save(crudo)
            partes.append(recortar(pcm(crudo)))
            if j:
                partes.insert(-1, silencio(COSTURA))

        datos = b''.join(partes)
        open(os.path.join(tmp, '%03d.raw' % i), 'wb').write(datos)
        dur = len(datos) / 2.0 / HZ
        pausa = float(b.get('p', 0.3))
        trozos.append(datos)
        trozos.append(silencio(pausa))

        meta.append(dict(i=i, v=v, inicio=round(t, 3), dur=round(dur, 3),
                         foto=b['foto'], z=b.get('z', 'completo'),
                         rot=b.get('rot'), tono=b.get('tono', 'normal'),
                         texto=b['t'].replace('*', '')))
        print('%3d %s %-6s %6.2f +%5.2fs r%+3d p%+2d  %s'
              % (i, VOCES[v][6], b.get('tono', 'normal'), t, dur, rate, pitch,
                 b['t'][:52]))
        t += dur + pausa

    bruto = os.path.join(tmp, 'todo.raw')
    open(bruto, 'wb').write(b''.join(trozos))
    salida = os.path.join(PUBLICO, 'narracion_%s.mp3' % nombre)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(HZ),
                    '-ac', '1', '-i', bruto,
                    '-af', 'loudnorm=I=-18:TP=-2:LRA=11',
                    '-b:a', '160k', salida], check=True)

    print('AUDITORIA en', tmp)
    ficha = dict(portadilla=PORTADILLA, total=round(t, 3), beats=meta)
    io.open(os.path.join(AQUI, 'beats_%s.json' % nombre), 'w', encoding='utf-8').write(
        json.dumps(ficha, ensure_ascii=False, indent=1))

    print('\n%d latidos · total %.1f s (%d min %02d s)' % (len(meta), t, t // 60, t % 60))
    print('->', salida)


if __name__ == '__main__':
    asyncio.run(principal(sys.argv[1], sys.argv[2]))
