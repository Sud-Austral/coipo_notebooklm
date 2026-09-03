# -*- coding: utf-8 -*-
"""Narración de un guion cualquiera: genera la voz, la une en una pista y
anota en qué segundo empieza cada sección.

Uso:  python narrar.py <modulo_guion> <nombre>
      python narrar.py guion_contrato contrato

Deja  public/narracion_<nombre>.mp3  y  secciones_<nombre>.json
La portadilla de Forestín NO lleva voz: su hueco se reserva aquí.
"""
import asyncio, importlib, io, json, os, subprocess, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import edge_tts

PUBLIC = r'c:\Users\luis.monsalve\Documents\GitHub\coipo_notebooklm\video\public'
# Dos locutores chilenos alternando: Lorenzo lleva el hilo, Catalina entra en
# los remates y los datos. Alternar rompe la monotonía de una sola voz.
VOCES = {'l': 'es-CL-LorenzoNeural', 'c': 'es-CL-CatalinaNeural'}
RATE = {'l': '-4%', 'c': '-2%'}
COLA, COLA_FIN = 1.0, 2.4
PORTADILLA = 10.0          # segundos de música antes de la primera palabra


def duracion(ruta):
    r = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
                        '-of', 'csv=p=0', ruta], capture_output=True, text=True, timeout=60)
    return float(r.stdout.strip())


async def main():
    modulo, nombre = sys.argv[1], sys.argv[2]
    GUION = importlib.import_module(modulo).GUION
    carpeta = os.path.join(AQUI, 'audio_' + nombre)
    os.makedirs(carpeta, exist_ok=True)
    os.makedirs(PUBLIC, exist_ok=True)

    partes, secciones = [], []
    # el silencio inicial ocupa exactamente la portadilla
    silencio = os.path.join(carpeta, 'silencio.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi',
                    '-i', 'anullsrc=r=48000:cl=stereo', '-t', '%.3f' % PORTADILLA,
                    '-c:a', 'libmp3lame', '-b:a', '192k', silencio], check=True)
    partes.append(silencio)
    t = PORTADILLA

    for i, b in enumerate(GUION):
        crudo = os.path.join(carpeta, '%02d.mp3' % i)
        v = b.get('voz', 'l')
        await edge_tts.Communicate(b['texto'], VOCES[v], rate=RATE[v]).save(crudo)
        cola = COLA_FIN if i == len(GUION) - 1 else COLA
        dur = duracion(crudo) + cola
        pad = os.path.join(carpeta, 'p%02d.mp3' % i)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', crudo,
                        '-af', 'apad=pad_dur=%.3f' % cola, '-t', '%.3f' % dur, pad], check=True)
        partes.append(pad)
        secciones.append({'id': b['id'], 'voz': v, 'inicio': round(t, 3), 'dur': round(dur, 3)})
        print('%-14s %s  inicio %6.1f s   dura %5.1f s'
              % (b['id'], VOCES[v].split('-')[2][:8], t, dur))
        t += dur

    lista = os.path.join(carpeta, 'lista.txt')
    with io.open(lista, 'w', encoding='utf-8') as f:
        for p in partes:
            f.write("file '" + p.replace(os.sep, '/') + "'\n")
    salida = os.path.join(PUBLIC, 'narracion_%s.mp3' % nombre)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0',
                    '-i', lista, '-c', 'copy', salida], check=True)

    json.dump({'portadilla': PORTADILLA, 'secciones': secciones, 'total': round(t, 3)},
              open(os.path.join(AQUI, 'secciones_%s.json' % nombre), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('\ntotal %.1f s  (%d min %02d s)  ->  %s' % (t, t // 60, t % 60, salida))


if __name__ == '__main__':
    asyncio.run(main())
