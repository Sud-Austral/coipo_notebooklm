# -*- coding: utf-8 -*-
"""Genera qwen_voces.ipynb.

El cuaderno se escribe con Python y no a mano: un .ipynb es JSON, y escribirlo
directo obliga a escapar cada comilla del código de dentro.

Este es un EXPERIMENTO paralelo. Los tres vídeos se hacen con edge-tts, que es
lo que Luis eligió al quedarse con la muestra C acelerada un 10 %.
"""
import io, json, os

AQUI = os.path.dirname(os.path.abspath(__file__))


def md(t):
    return {"cell_type": "markdown", "metadata": {}, "source": t.splitlines(True)}


def code(t):
    return {"cell_type": "code", "metadata": {}, "execution_count": None,
            "outputs": [], "source": t.splitlines(True)}


C = []

C.append(md("""# Voces con Qwen3-TTS · vídeos CONAF

Genera la narración de un vídeo del pipeline `coipo_notebooklm/video` con
**Qwen3-TTS Voice Design**: las voces se crean describiéndolas en texto, así que
no se clona a nadie y se puede pedir acento chileno explícitamente.

**Antes de ejecutar:** *Entorno de ejecución → Cambiar tipo de entorno → GPU (T4)*.

Descarga al final dos archivos: `narracion_<nombre>.mp3` y `beats_<nombre>.json`.
El JSON lleva la duración exacta de cada frase y es lo que sostiene la sincronía
del vídeo, así que no se puede regenerar el audio sin regenerar el JSON.

> **Sin probar.** La máquina donde se escribió no tiene GPU. Está hecho contra la
> API publicada de Qwen3-TTS, y la celda 4 sintetiza sólo cinco frases para que
> un fallo salte en un minuto y no en veinte.
"""))

C.append(md("## 1 · Comprobar la GPU"))
C.append(code("""import subprocess, torch
print(subprocess.run(['nvidia-smi', '--query-gpu=name,memory.total', '--format=csv'],
                     capture_output=True, text=True).stdout)
assert torch.cuda.is_available(), 'Sin GPU: Entorno de ejecucion -> Cambiar tipo -> GPU'
cap = torch.cuda.get_device_capability()
print('capacidad CUDA:', cap)

# flash-attention-2 exige Ampere (8.0+). La T4 gratuita de Colab es Turing (7.5)
# y revienta al cargar el modelo si se le pide.
ATTN = 'flash_attention_2' if cap[0] >= 8 else 'sdpa'
print('attn_implementation ->', ATTN)"""))

C.append(md("## 2 · Instalar"))
C.append(code("""!pip -q install -U qwen-tts soundfile numpy
!apt-get -qq install -y ffmpeg > /dev/null
print('listo')"""))

C.append(md("""## 3 · Cargar el modelo

`VoiceDesign` crea la voz desde una descripción en texto. En bfloat16 ocupa unos
3,4 GB, así que entra de sobra en los 16 GB de una T4."""))
C.append(code("""from qwen_tts import Qwen3TTSModel

modelo = Qwen3TTSModel.from_pretrained(
    'Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign',
    device_map='cuda:0', dtype=torch.bfloat16, attn_implementation=ATTN)
print('modelo cargado')"""))

C.append(md("""## 4 · Prueba de voz — esto es lo que hay que juzgar

Un intercambio corto entre las dos voces, con las mismas frases de la muestra C
que ya oíste con edge-tts: una cifra con énfasis, una reacción rápida y dos
líneas de complicidad. Tarda un minuto.

**Escúchalo y compáralo con `muestra-voces-C-chilenas-con-coqueteo.mp3` del
repo.** Si el acento chileno no convence, cambia las descripciones de aquí
mismo y vuelve a ejecutar esta celda: es barato. Sólo cuando te guste, sigue a
la celda 5. No hay forma de saberlo por especificaciones.

**Sobre el tono entre las dos voces:** una cercanía cómplice apenas perceptible
—que se escucha en cómo se escuchan, no en lo que dicen—. Techo duro: **nunca
explícito**, nunca verbalizado, nunca seductor. Profesional y cálido siempre.
Si notas que la voz se pasa de ahí, quita la frase `CERCANIA` de las
descripciones y vuelve a generar."""))
C.append(code("""import soundfile as sf, IPython.display as ipd, numpy as np

# El coqueteo va en la ENTREGA, no en las palabras: una cercania complice
# apenas perceptible. Nunca explicito, nunca verbalizado, nunca seductor. Si al
# quitarlo el episodio no pierde informacion, esta bien puesto.
CERCANIA = (' Se dirige a su companero de programa con una cercania complice '
            'apenas perceptible: escucha de verdad, se le nota que disfruta la '
            'conversacion. Nunca coqueto de forma evidente ni seductor; '
            'profesional y calido en todo momento.')

VOZ_C = ('Mujer chilena de unos treinta y cinco anos, voz calida y clara, '
         'tono conversacional de podcast, diccion natural de Santiago de Chile, '
         'sin acento espanol ni mexicano, ritmo agil y seguro.' + CERCANIA)
VOZ_L = ('Hombre chileno de unos cuarenta anos, voz grave y cercana, '
         'tono conversacional de podcast, diccion natural de Santiago de Chile, '
         'sin acento espanol ni mexicano, curioso y relajado.' + CERCANIA)

PRUEBA = [
    ('c', 'Y bosques, dieciocho coma nueve millones. Un veinticinco por ciento del pais.',
     ' Enfasis claro en la cifra: mas lenta, mas alta y mas fuerte.'),
    ('l', 'Veinticinco por ciento? Eso suena a titular.',
     ' Reaccion rapida, con chispa.'),
    ('c', 'Suena. Y ahi esta justo la trampa.', ' Reaccion rapida, con chispa.'),
    ('l', 'Ya decia yo que te traias algo entre manos.',
     ' Mas bajo y calido, con complicidad.'),
    ('c', 'Me conoces demasiado bien para lo poco que llevamos.',
     ' Mas bajo y calido, con complicidad.'),
]

VOCES_P = {'c': VOZ_C, 'l': VOZ_L}
trozos_prueba, sr = [], None
for quien, texto, matiz in PRUEBA:
    w, sr = modelo.generate_voice_design(text=texto, language='Spanish',
                                         instruct=VOCES_P[quien] + matiz)
    a = np.asarray(w[0] if np.ndim(w) > 1 else w, dtype=np.float32)
    trozos_prueba.append(a)
    trozos_prueba.append(np.zeros(int(0.30 * sr), dtype=np.float32))
sf.write('prueba.wav', np.concatenate(trozos_prueba), sr)
print('%.1f s a %d Hz' % (np.concatenate(trozos_prueba).size / sr, sr))
ipd.Audio('prueba.wav')"""))

C.append(md("""## 5 · Traer el guion desde GitHub

Se descarga la versión viva del repo para no copiar y pegar texto, que es como
se desincronizan las cosas."""))
C.append(code("""NOMBRE = 'catastro'          # catastro | contrato2 | ecosistema2
RAMA   = 'videos-v2'
BASE   = ('https://raw.githubusercontent.com/Sud-Austral/coipo_notebooklm/'
          + RAMA + '/video/pipeline')

import urllib.request, importlib.util
urllib.request.urlretrieve(BASE + '/guion_' + NOMBRE + '.py', 'guion.py')
spec = importlib.util.spec_from_file_location('g', 'guion.py')
g = importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
GUION = g.GUION
print(len(GUION), 'latidos |', sum(1 for b in GUION if '*' in b['t']), 'con enfasis')
print('primero:', GUION[0]['t'])"""))

C.append(md("""## 6 · Sintetizar

Dos diferencias con el pipeline local, y las dos son consecuencia de cómo
funciona Qwen:

- **No hay parámetro de velocidad.** El énfasis se pide en lenguaje natural por
  el `instruct`, y la aceleración global se aplica después con `atempo`, que
  conserva el tono. Reescalar la muestra subiría el pitch y dejaría las voces
  agudas.
- **El recorte de silencio se mantiene** por la misma razón medida en local: sin
  él, una pausa de 0,15 s del guion acaba durando 0,75 s y la conversación se
  arrastra."""))
C.append(code("""import json, time
from tqdm.auto import tqdm

ACELERACION = 1.10       # 10 % mas rapido, como la muestra C elegida
COSTURA     = 0.055      # micro-pausa entre trozos de una misma frase
PORTADILLA  = 10.0       # los 10 s de Forestin, intocables
HZ          = 24000

MATIZ = {'normal': 'tono conversacional, natural.',
         'lento':  'mas pausado y grave, subrayando la idea.',
         'vivo':   'reaccion rapida, con chispa.',
         'suave':  'mas bajo y calido, con complicidad.'}


def trozos(t):
    crudos = [(x, i % 2 == 1) for i, x in enumerate(t.split('*')) if x]
    fuera = []
    for x, mk in (crudos or [(t, False)]):
        if not any(c.isalnum() for c in x) and fuera:
            fuera[-1] = (fuera[-1][0] + x, fuera[-1][1])
        else:
            fuera.append((x, mk))
    return fuera


def recortar(a, guarda=0.09, umbral=0.006):
    if a.size == 0:
        return a
    idx = np.nonzero(np.abs(a) > (np.abs(a).max() or 1.0) * umbral)[0]
    if idx.size == 0:
        return a
    g = int(guarda * HZ)
    return a[max(0, idx[0] - g): min(a.size, idx[-1] + g)]


def decir(texto, voz, matiz, enfatico):
    ins = voz + ' ' + matiz
    if enfatico:
        ins += ' Marca esta parte con enfasis claro: mas lenta, mas alta y mas fuerte.'
    w, sr = modelo.generate_voice_design(text=texto, language='Spanish', instruct=ins)
    a = np.asarray(w[0] if np.ndim(w) > 1 else w, dtype=np.float32)
    if sr != HZ:
        n = int(round(a.size * HZ / sr))
        a = np.interp(np.linspace(0, a.size - 1, n), np.arange(a.size), a).astype(np.float32)
    return a


VOCES = {'c': VOZ_C, 'l': VOZ_L}
piezas, meta, t = [], [], PORTADILLA
t_ini = time.time()

# La barra cuenta TROZOS y no latidos: un latido con enfasis son dos o tres
# llamadas al modelo, asi que contar latidos daria un tiempo restante mentiroso.
plan = [(i, b, trozos(b['t'])) for i, b in enumerate(GUION)]
total_trozos = sum(len(x[2]) for x in plan)
barra = tqdm(total=total_trozos, desc='sintetizando', unit='trozo')

for i, b, piezas_texto in plan:
    partes = []
    for j, (txt, mk) in enumerate(piezas_texto):
        if j:
            partes.append(np.zeros(int(COSTURA * HZ), dtype=np.float32))
        partes.append(recortar(decir(txt.strip(), VOCES[b['v']],
                                     MATIZ[b.get('tono', 'normal')], mk)))
        barra.update(1)
    audio = np.concatenate(partes)
    pausa = float(b.get('p', 0.3))
    piezas.append(audio)
    piezas.append(np.zeros(int(pausa * HZ), dtype=np.float32))
    # Las duraciones del JSON son las de DESPUES de acelerar.
    meta.append(dict(i=i, v=b['v'], inicio=round(t, 3),
                     dur=round(audio.size / HZ / ACELERACION, 3),
                     foto=b['foto'], z=b.get('z', 'completo'), rot=b.get('rot'),
                     tono=b.get('tono', 'normal'), texto=b['t'].replace('*', '')))
    t += (audio.size / HZ + pausa) / ACELERACION
    barra.set_postfix_str('%d/%d latidos · audio %.0f s' % (i + 1, len(GUION), t))

barra.close()
sf.write('crudo.wav', np.concatenate(piezas), HZ)
print('sintesis terminada en %.0f s (%.1f min)'
      % (time.time() - t_ini, (time.time() - t_ini) / 60))"""))

C.append(md("## 7 · Acelerar, normalizar y comprobar"))
C.append(code("""mp3 = 'narracion_' + NOMBRE + '.mp3'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'crudo.wav',
                '-af', 'atempo=%s,loudnorm=I=-18:TP=-2:LRA=11' % ACELERACION,
                '-b:a', '160k', mp3], check=True)

fichero_json = 'beats_' + NOMBRE + '.json'
open(fichero_json, 'w', encoding='utf-8').write(
    json.dumps(dict(portadilla=PORTADILLA, total=round(t, 3), beats=meta),
               ensure_ascii=False, indent=1))

d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                          '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout)
print('%s  %.1f s  (%d min %02d s)' % (mp3, d, d // 60, d % 60))
print('el JSON dice %.1f s  ->  desfase %.2f s' % (t, abs(d - t)))
print('Si el desfase pasa de 1 s, el video saldra descuadrado: no lo uses.')
ipd.Audio(mp3)"""))

C.append(md("""## 8 · Descargar

`narracion_*.mp3` va a `video/public/`, y `beats_*.json` a `video/src/` **y** a
`video/pipeline/`. Después, en el PC:

```
cd video && npx remotion render src/index.jsx Catastro out/catastro.mp4
```"""))
C.append(code("""from google.colab import files
files.download(mp3)
files.download(fichero_json)"""))

nb = {"cells": C,
      "metadata": {"accelerator": "GPU",
                   "colab": {"provenance": [], "gpuType": "T4"},
                   "kernelspec": {"display_name": "Python 3", "name": "python3"},
                   "language_info": {"name": "python"}},
      "nbformat": 4, "nbformat_minor": 0}

destino = os.path.join(AQUI, 'qwen_voces.ipynb')
io.open(destino, 'w', encoding='utf-8').write(json.dumps(nb, ensure_ascii=False, indent=1))
print('escrito %s con %d celdas' % (destino, len(C)))
