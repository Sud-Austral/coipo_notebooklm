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
import array, asyncio, importlib, io, json, os, subprocess, sys, tempfile

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


# ------------------------------------------------------------------ ritmo
# Tres cosas que hacen que una conversacion sintetizada suene a clips pegados,
# y que no son la voz sino el MONTAJE:
#
# 1. El hueco entre turnos es silencio digital exacto. Medido: -180 dB. Ningun
#    microfono da eso; suena a corte.
# 2. Nadie se solapa. En una conversacion real la replica rapida empieza ANTES
#    de que el otro termine, y eso es lo que la hace sonar viva.
# 3. Las pausas son todas parecidas porque salen de un numero escrito a mano.
#
# Aqui la pausa se deduce de la FUNCION del cambio de turno, no del guion.
SOLAPE = 0.11          # la reaccion rapida pisa el final del otro
RUIDO_SALA = 0.0016    # ~ -56 dB; suficiente para que el hueco no sea un vacio


def hueco(actual, siguiente):
    """Segundos entre dos latidos. Negativo = se solapan."""
    if siguiente is None:
        return 0.6
    mismo = actual['v'] == siguiente['v']
    if mismo:
        return 0.20                      # respirar dentro del propio turno
    if siguiente.get('tono') == 'vivo':
        return -SOLAPE                   # le pisa la frase: interrumpe
    if float(actual.get('p', 0.3)) >= 0.55:
        return 0.42                      # cambio de tema: si hay aire
    return 0.13                          # turno normal: casi encadenado


def sala(n):
    """Ruido de sala, para que el silencio no sea un cero perfecto."""
    import random
    r = random.Random(7)                 # fijo: el mismo guion da el mismo audio
    amp = int(RUIDO_SALA * 32767)
    return array.array('h', [r.randint(-amp, amp) for _ in range(n)]).tobytes()


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
    # El silencio de la portadilla va DENTRO del mp3: el primer latido se coloca
    # en t=PORTADILLA sobre un lienzo que empieza en cero. Sin eso, el audio
    # arranca en el segundo cero mientras el video aun muestra a Forestin, las
    # voces se pisan con la musica y todo queda 10 s adelantado. Ya pasó.
    piezas, meta, t = [], [], PORTADILLA

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
        # El hueco sale de la funcion del cambio de turno, no del guion, y puede
        # ser NEGATIVO: la reaccion rapida pisa el final de la otra voz. Por eso
        # esto se mezcla muestra a muestra y no se concatena.
        pausa = hueco(b, guion[i + 1] if i + 1 < len(guion) else None)
        piezas.append((t, datos))

        meta.append(dict(i=i, v=v, inicio=round(t, 3), dur=round(dur, 3),
                         foto=b['foto'], z=b.get('z', 'completo'),
                         rot=b.get('rot'), tono=b.get('tono', 'normal'),
                         texto=b['t'].replace('*', '')))
        print('%3d %s %-6s %6.2f +%5.2fs r%+3d p%+2d  %s'
              % (i, VOCES[v][6], b.get('tono', 'normal'), t, dur, rate, pitch,
                 b['t'][:52]))
        t += dur + pausa

    # Montaje por POSICION, no por concatenacion: los latidos que se solapan se
    # suman muestra a muestra. Y encima va ruido de sala, para que los huecos no
    # sean el cero perfecto que delata que esto son clips pegados.
    largo = int((t + 1.0) * HZ)
    mezcla = array.array('h', sala(largo))
    for inicio, datos in piezas:
        m = array.array('h'); m.frombytes(datos)
        off = int(inicio * HZ)
        for k in range(len(m)):
            j = off + k
            if j < largo:
                x = mezcla[j] + m[k]
                mezcla[j] = 32767 if x > 32767 else (-32768 if x < -32768 else x)

    bruto = os.path.join(tmp, 'todo.raw')
    open(bruto, 'wb').write(mezcla.tobytes())
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
