# -*- coding: utf-8 -*-
r"""Genera qwen_voces.ipynb y COMPRUEBA que compila antes de escribirlo.

Dos lecciones pagadas viven aquí:

1. Un .ipynb es JSON, así que escribirlo a mano obliga a escapar cada comilla
   del código de dentro. Se genera con Python.
2. Este archivo se edita con un editor, NUNCA parcheándolo desde un heredoc de
   bash: las barras invertidas se destrozan por el camino y un `\n` acaba siendo
   un salto de línea real dentro de una cadena. Así se publicaron tres celdas
   que no compilaban.

De ahí la comprobación final: cada celda de código se pasa por `ast.parse`, y si
alguna no compila NO se escribe el cuaderno.

Esto es un EXPERIMENTO paralelo. Los tres vídeos se hacen con edge-tts, que es
lo que quedó al elegir la muestra C acelerada un 10 %.
"""
import ast
import io
import json
import os

AQUI = os.path.dirname(os.path.abspath(__file__))

# Versiones comprobadas en PyPI, no de memoria:
#   qwen-tts 0.1.1       fija transformers==4.57.3 y accelerate==1.12.0
#   transformers 4.57.3  exige huggingface-hub<1.0,>=0.34 (la última 0.x es la
#                        0.36.2) y tokenizers>=0.22.0,<=0.23.0
PINES = {'qwen-tts': '0.1.1', 'transformers': '4.57.3',
         'huggingface-hub': '0.36.2', 'tokenizers': '0.22.2',
         'accelerate': '1.12.0'}


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

**Antes de empezar:** *Entorno de ejecución → Cambiar tipo de entorno → GPU (T4)*.

Al final descarga `narracion_<nombre>.mp3` y `beats_<nombre>.json`. **Van
siempre juntos**: el JSON lleva la duración exacta de cada frase y es lo único
que sostiene la sincronía del vídeo.

> **Sin probar.** La máquina donde se escribió no tiene GPU. Está hecho contra
> la API publicada de Qwen3-TTS, y la celda 4 sintetiza sólo cinco frases para
> que un fallo salte en un minuto y no en veinte.
"""))

C.append(md("## 1 · Comprobar la GPU"))
C.append(code("""import subprocess, torch

print(subprocess.run(['nvidia-smi', '--query-gpu=name,memory.total', '--format=csv'],
                     capture_output=True, text=True).stdout)
assert torch.cuda.is_available(), (
    'Sin GPU. Entorno de ejecucion -> Cambiar tipo de entorno -> GPU')
cap = torch.cuda.get_device_capability()
print('capacidad CUDA:', cap)

# flash-attention-2 exige Ampere (8.0+). La T4 gratuita de Colab es Turing (7.5)
# y revienta al cargar el modelo si se le pide. Se vuelve a calcular en la
# celda 3, porque el reinicio de la celda 2 borra todo lo de aqui.
print('attn_implementation sera:',
      'flash_attention_2' if cap[0] >= 8 else 'sdpa')"""))

C.append(md("""## 2 · Instalar · **esta celda reinicia el entorno**

`qwen-tts` fija `transformers==4.57.3` exacto, y Colab trae preinstalada una v5
donde `GenerationMixin` ya no vive en `transformers.generation`. Pip instala la
correcta, pero **el kernel sigue con la vieja cargada en memoria**, así que la
celda 3 fallaría con un `ImportError` críptico si no se reinicia.

Al terminar verás **«Your session crashed»** o «el kernel se reinició»: **es lo
esperado, no es un error.**

Después del reinicio, **sigue desde la celda 3.** No repitas ésta."""))

_pip = ' '.join('%s==%s' % (k, v) for k, v in PINES.items())
C.append(code("""# Versiones EXACTAS, comprobadas en PyPI, no dejadas a la resolucion de pip.
# Colab trae transformers v5 y huggingface-hub 1.x preinstalados, y de ahi sale
# el choque; fijandolo todo, la instalacion es determinista.
!pip -q install """ + _pip + """ soundfile
# sox NO es solo el paquete de pip: qwen-tts llama al BINARIO, y Colab no lo
# trae. Sin esto sale «/bin/sh: 1: sox: not found» al importar.
!apt-get -qq install -y ffmpeg sox libsox-fmt-all > /dev/null
!which sox || echo 'OJO: sox sigue sin instalarse'

ESPERADO = """ + repr(PINES) + """

import importlib.metadata as md
malas = []
for pkg, quiero in ESPERADO.items():
    try:
        hay = md.version(pkg)
    except Exception:
        hay = 'NO INSTALADO'
    if hay != quiero:
        malas.append(pkg)
    print('%-18s %-12s %s' % (pkg, hay,
                              'ok' if hay == quiero else 'DISTINTA, esperaba ' + quiero))
print()
if malas:
    print('OJO, no cuadran:', ', '.join(malas))

# El aviso de pip sobre diffusers es inofensivo: pide huggingface-hub 1.x, pero
# no lo usamos y aqui manda transformers.
print('Reiniciando el entorno. Cuando vuelva, sigue DESDE LA CELDA 3.')
import IPython
IPython.Application.instance().kernel.do_shutdown(True)"""))

C.append(md("""## 3 · Cargar el modelo

`VoiceDesign` crea la voz desde una descripción en texto. En bfloat16 ocupa unos
3,4 GB, así que entra de sobra en los 16 GB de una T4."""))
C.append(code("""import torch, importlib.metadata as md

# Comprobar ANTES de importar: si las versiones no son las que qwen-tts fija, el
# fallo sale aqui y dice que hacer, en vez de como un ImportError sobre
# GenerationMixin tres marcos mas abajo.
ESPERADO = """ + repr(PINES) + """
hay = {}
for k in ESPERADO:
    try:
        hay[k] = md.version(k)
    except Exception:
        hay[k] = 'NO INSTALADO'
print(' | '.join('%s %s' % (k, v) for k, v in hay.items()))

malas = [k for k in ESPERADO if hay[k] != ESPERADO[k]]
if malas:
    raise SystemExit('Versiones equivocadas en: ' + ', '.join(malas) +
                     '. Ejecuta la celda 2 y REINICIA el entorno antes de volver aqui.')

cap = torch.cuda.get_device_capability()
ATTN = 'flash_attention_2' if cap[0] >= 8 else 'sdpa'


def memoria(cuando):
    import psutil
    ram = psutil.virtual_memory()
    vram = torch.cuda.memory_allocated() / 2**30 if torch.cuda.is_available() else 0
    print('%-22s RAM %.1f/%.1f GB libres %.1f | VRAM usada %.1f GB'
          % (cuando, (ram.total - ram.available) / 2**30, ram.total / 2**30,
             ram.available / 2**30, vram))


# La RAM del sistema es la que mata el kernel en Colab, no la VRAM: el proceso
# se muere sin traza y solo se ve «restarting kernel (1/5)» en los logs. Por eso
# se mide antes y despues.
memoria('antes de importar')
from qwen_tts import Qwen3TTSModel
memoria('tras importar')

MODELO = 'Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign'
# Ojo: VoiceDesign SOLO existe en 1.7B. Las variantes 0.6B son CustomVoice y
# Base, que no admiten describir la voz con texto.
try:
    modelo = Qwen3TTSModel.from_pretrained(
        MODELO, device_map='cuda:0', dtype=torch.bfloat16,
        attn_implementation=ATTN, low_cpu_mem_usage=True)
except Exception as e:
    print('FALLO al cargar:', type(e).__name__, e)
    memoria('en el fallo')
    raise

memoria('modelo cargado')
print('listo:', MODELO, 'con', ATTN)"""))

C.append(md("""## 4 · Prueba de voz — esto es lo que hay que juzgar

Un intercambio corto entre las dos voces, con **las mismas frases** de la
muestra C que ya oíste con edge-tts: una cifra con énfasis, una reacción rápida
y dos líneas de complicidad. Tarda un minuto.

**Escúchalo y compáralo con `video/muestra-voces-C-chilenas-con-coqueteo.mp3`
del repo.** Si el acento chileno no convence, cambia las descripciones aquí
mismo y vuelve a ejecutar esta celda: cuesta un minuto por intento. Sólo cuando
te guste, sigue a la celda 5 — las celdas 5 a 7 tardan bastante y sería tirarlas.

**Sobre el tono entre las dos voces:** una cercanía cómplice apenas perceptible,
que se escucha en cómo se escuchan y no en lo que dicen. Techo duro: **nunca
explícito**, nunca verbalizado, nunca seductor. Profesional y cálido siempre. Si
notas que se pasa de ahí, quita `CERCANIA` de las descripciones."""))
C.append(code("""import soundfile as sf, numpy as np, IPython.display as ipd

# El coqueteo va en la ENTREGA, no en las palabras.
CERCANIA = (' Se dirige a su companero de programa con una cercania complice '
            'apenas perceptible: escucha de verdad y se le nota que disfruta la '
            'conversacion. Nunca coqueto de forma evidente ni seductor; '
            'profesional y calido en todo momento.')

VOZ_C = ('Mujer chilena de unos treinta y cinco anos, voz calida y clara, '
         'tono conversacional de podcast, diccion natural de Santiago de Chile, '
         'sin acento espanol ni mexicano, ritmo agil y seguro.' + CERCANIA)
VOZ_L = ('Hombre chileno de unos cuarenta anos, voz grave y cercana, '
         'tono conversacional de podcast, diccion natural de Santiago de Chile, '
         'sin acento espanol ni mexicano, curioso y relajado.' + CERCANIA)
VOCES = {'c': VOZ_C, 'l': VOZ_L}

PRUEBA = [
    ('c', 'Y bosques, dieciocho coma nueve millones. Un veinticinco por ciento del pais.',
     ' Enfasis claro en la cifra: mas lenta, mas alta y mas fuerte.'),
    ('l', 'Veinticinco por ciento? Eso suena a titular.', ' Reaccion rapida, con chispa.'),
    ('c', 'Suena. Y ahi esta justo la trampa.', ' Reaccion rapida, con chispa.'),
    ('l', 'Ya decia yo que te traias algo entre manos.', ' Mas bajo y calido, con complicidad.'),
    ('c', 'Me conoces demasiado bien para lo poco que llevamos.',
     ' Mas bajo y calido, con complicidad.'),
]

piezas, sr = [], 24000
for quien, texto, matiz in PRUEBA:
    w, sr = modelo.generate_voice_design(text=texto, language='Spanish',
                                         instruct=VOCES[quien] + matiz)
    a = np.asarray(w[0] if np.ndim(w) > 1 else w, dtype=np.float32)
    piezas.append(a)
    piezas.append(np.zeros(int(0.30 * sr), dtype=np.float32))

audio = np.concatenate(piezas)
sf.write('prueba.wav', audio, sr)
print('%.1f s a %d Hz' % (audio.size / sr, sr))
ipd.Audio('prueba.wav')"""))

C.append(md("""## 5 · Traer el guion desde GitHub

Se descarga la versión viva del repo, para no copiar y pegar texto — que es
justo como se desincronizan las cosas."""))
C.append(code("""NOMBRE = 'catastro'      # catastro | contrato_pod | ecosistema_pod
RAMA = 'videos-v2'
BASE = ('https://raw.githubusercontent.com/Sud-Austral/coipo_notebooklm/'
        + RAMA + '/video/pipeline')

import urllib.request, importlib.util
urllib.request.urlretrieve(BASE + '/guion_' + NOMBRE + '.py', 'guion.py')
spec = importlib.util.spec_from_file_location('g', 'guion.py')
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)
GUION = g.GUION

print(len(GUION), 'latidos |', sum(1 for b in GUION if '*' in b['t']), 'con enfasis')
print('primero:', GUION[0]['t'])"""))

C.append(md("""## 6 · Sintetizar

Dos diferencias con el pipeline local, y las dos salen de cómo funciona Qwen:

- **No hay parámetro de velocidad.** El énfasis se pide en lenguaje natural por
  el `instruct`, y la aceleración global se aplica después con `atempo`, que
  **conserva el tono**. Reescalar la muestra subiría el pitch y dejaría las
  voces agudas.
- **Se recorta el silencio de cada trozo**, por la misma razón medida en local:
  sin eso, una pausa de 0,15 s del guion acaba durando 0,75 s y la conversación
  se arrastra.

La barra cuenta **trozos**, no latidos: un latido con énfasis son dos o tres
llamadas al modelo, así que contar latidos daría un tiempo restante mentiroso."""))
C.append(code("""import json, time, subprocess
from tqdm.auto import tqdm

ACELERACION = 1.10     # 10 % mas rapido, como la muestra C elegida
COSTURA = 0.055        # micro-pausa entre trozos de una misma frase
PORTADILLA = 10.0      # los 10 s de Forestin, intocables
HZ = 24000

MATIZ = {'normal': 'tono conversacional, natural.',
         'lento': 'mas pausado y grave, subrayando la idea.',
         'vivo': 'reaccion rapida, con chispa.',
         'suave': 'mas bajo y calido, con complicidad.'}


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
    pico = float(np.abs(a).max()) or 1.0
    idx = np.nonzero(np.abs(a) > pico * umbral)[0]
    if idx.size == 0:
        return a
    g = int(guarda * HZ)
    return a[max(0, idx[0] - g):min(a.size, idx[-1] + g)]


def decir(texto, voz, matiz, enfatico):
    ins = voz + ' ' + matiz
    if enfatico:
        ins += ' Marca esta parte con enfasis claro: mas lenta, mas alta y mas fuerte.'
    w, sr = modelo.generate_voice_design(text=texto, language='Spanish', instruct=ins)
    a = np.asarray(w[0] if np.ndim(w) > 1 else w, dtype=np.float32)
    if sr != HZ:
        n = int(round(a.size * HZ / sr))
        a = np.interp(np.linspace(0, a.size - 1, n), np.arange(a.size), a)
        a = a.astype(np.float32)
    return a


plan = [(i, b, trozos(b['t'])) for i, b in enumerate(GUION)]
barra = tqdm(total=sum(len(x[2]) for x in plan), desc='sintetizando', unit='trozo')

piezas, meta, t = [], [], PORTADILLA
t_ini = time.time()

for i, b, texto_trozos in plan:
    partes = []
    for j, (txt, mk) in enumerate(texto_trozos):
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
                     foto=b['foto'], z=b.get('z', 'completo'),
                     rot=b.get('rot'), tono=b.get('tono', 'normal'),
                     texto=b['t'].replace('*', '')))
    t += (audio.size / HZ + pausa) / ACELERACION
    barra.set_postfix_str('%d/%d latidos - %.0f s de audio' % (i + 1, len(GUION), t))

barra.close()
sf.write('crudo.wav', np.concatenate(piezas), HZ)
print('sintesis terminada en %.1f min' % ((time.time() - t_ini) / 60))"""))

C.append(md("## 7 · Acelerar, normalizar y comprobar"))
C.append(code("""mp3 = 'narracion_' + NOMBRE + '.mp3'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'crudo.wav',
                '-af', 'atempo=' + str(ACELERACION) + ',loudnorm=I=-18:TP=-2:LRA=11',
                '-b:a', '160k', mp3], check=True)

fichero = 'beats_' + NOMBRE + '.json'
with open(fichero, 'w', encoding='utf-8') as f:
    json.dump(dict(portadilla=PORTADILLA, total=round(t, 3), beats=meta),
              f, ensure_ascii=False, indent=1)

d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                          '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout)
print('%s  %.1f s  (%d min %02d s)' % (mp3, d, d // 60, d % 60))
print('el JSON dice %.1f s  ->  desfase %.2f s' % (t, abs(d - t)))
if abs(d - t) > 1.0:
    print('DESFASE ALTO: el video saldria descuadrado. No uses estos archivos.')
ipd.Audio(mp3)"""))

C.append(md("""## 8 · Descargar

`narracion_*.mp3` va a `video/public/`, y `beats_*.json` a `video/src/` **y** a
`video/pipeline/`. Después, en el PC:

```
cd video && npx remotion render src/index.jsx Catastro out/catastro.mp4
```"""))
C.append(code("""from google.colab import files

files.download(mp3)
files.download(fichero)"""))


def comprobar(celdas):
    """Cada celda de código tiene que compilar. Si no, no se escribe nada."""
    fallos = []
    for i, c in enumerate(celdas):
        if c['cell_type'] != 'code':
            continue
        src = ''.join(c['source'])
        # Las líneas mágicas de Colab (!pip, %cd) no son Python válido y hay que
        # neutralizarlas. Se mira la línea CRUDA y no la recortada: una magia va
        # siempre en la columna 0, mientras que una continuación de formato
        # —`          % (cuando, ...)`— empieza por «%» pero indentada. Mirando
        # la recortada, el verificador convertía esa continuación en `pass` y
        # cantaba un «unmatched ')'» que no existía.
        limpio = '\n'.join('pass' if l.startswith(('!', '%')) else l
                           for l in src.split('\n'))
        try:
            ast.parse(limpio)
        except SyntaxError as e:
            linea = src.split('\n')[e.lineno - 1] if e.lineno else ''
            fallos.append('celda %d, linea %s: %s\n      >>> %s'
                          % (i, e.lineno, e.msg, linea[:78]))
    return fallos


if __name__ == '__main__':
    fallos = comprobar(C)
    if fallos:
        print('NO SE ESCRIBE NADA. Celdas que no compilan:')
        for f in fallos:
            print('  ', f)
        raise SystemExit(1)

    nb = {"cells": C,
          "metadata": {"accelerator": "GPU",
                       "colab": {"provenance": [], "gpuType": "T4"},
                       "kernelspec": {"display_name": "Python 3", "name": "python3"},
                       "language_info": {"name": "python"}},
          "nbformat": 4, "nbformat_minor": 0}
    destino = os.path.join(AQUI, 'qwen_voces.ipynb')
    with io.open(destino, 'w', encoding='utf-8') as f:
        json.dump(nb, f, ensure_ascii=False, indent=1)
    print('%d celdas, todas compilan -> %s' % (len(C), destino))
