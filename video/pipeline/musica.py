# -*- coding: utf-8 -*-
"""Música de cabecera de 10 s, sintetizada.

Se genera en vez de descargarse para no depender de licencias de terceros.
Es un acorde sostenido que cambia a la mitad, con dos campanas suaves: la
intención es que la sala se calle, no llamar la atención sobre la música.
"""
import io, os, subprocess, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
DEST = r'c:\Users\luis.monsalve\Documents\GitHub\coipo_notebooklm\video\public'
DUR = 10.0

# Fa mayor los primeros 5 s, Sol mayor después: una cadencia sencilla que
# resuelve justo cuando entra la voz.
ACORDE_A = [174.61, 220.00, 261.63]      # F3 A3 C4
ACORDE_B = [196.00, 246.94, 293.66]      # G3 B3 D4
CAMPANA = [880.00, 1318.51]              # A5 y E6


def main():
    os.makedirs(DEST, exist_ok=True)
    entradas, filtros, mezcla = [], [], []
    n = 0

    def sine(freq, dur):
        nonlocal n
        entradas.extend(['-f', 'lavfi', '-t', '%.2f' % dur,
                         '-i', 'sine=frequency=%.2f:sample_rate=48000' % freq])
        idx = n
        n += 1
        return idx

    # --- pad: dos acordes encadenados, con leve trémolo
    for k, f in enumerate(ACORDE_A):
        i = sine(f, 5.6)
        filtros.append('[%d:a]volume=0.13,afade=t=in:st=0:d=1.6,'
                       'afade=t=out:st=4.6:d=1.0,tremolo=f=0.28:d=0.22[a%d]' % (i, i))
        mezcla.append('[a%d]' % i)
    for k, f in enumerate(ACORDE_B):
        i = sine(f, 5.2)
        filtros.append('[%d:a]volume=0.13,adelay=4800|4800,afade=t=in:st=4.8:d=1.0,'
                       'afade=t=out:st=8.2:d=1.8,tremolo=f=0.28:d=0.22[a%d]' % (i, i))
        mezcla.append('[a%d]' % i)

    # --- dos campanas: una al abrir, otra al cambiar de acorde
    for t_ms, vol in ((300, 0.20), (4900, 0.14)):
        for f in CAMPANA:
            i = sine(f, 3.2)
            filtros.append('[%d:a]volume=%.2f,adelay=%d|%d,'
                           'afade=t=out:st=0.05:d=2.6[a%d]' % (i, vol, t_ms, t_ms, i))
            mezcla.append('[a%d]' % i)

    filtros.append('%samix=inputs=%d:normalize=0[m];'
                   '[m]aecho=0.8:0.85:420|780:0.22|0.12,'
                   'highpass=f=90,lowpass=f=5200,'
                   # sin esto la mezcla queda en -42 dB: inaudible en una sala
                   'loudnorm=I=-17:TP=-2:LRA=9,'
                   'afade=t=out:st=%.2f:d=1.2,'
                   'atrim=0:%.2f,aformat=sample_rates=48000:channel_layouts=stereo[out]'
                   % (''.join(mezcla), len(mezcla), DUR - 1.2, DUR))

    salida = os.path.join(DEST, 'intro.mp3')
    cmd = (['ffmpeg', '-v', 'error', '-y'] + entradas +
           ['-filter_complex', ';'.join(filtros), '-map', '[out]',
            '-c:a', 'libmp3lame', '-b:a', '192k', salida])
    subprocess.run(cmd, check=True)

    r = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
                        '-of', 'csv=p=0', salida], capture_output=True, text=True)
    print('intro.mp3  %.2f s  %.0f KB' % (float(r.stdout.strip()),
                                          os.path.getsize(salida) / 1024))


if __name__ == '__main__':
    main()
