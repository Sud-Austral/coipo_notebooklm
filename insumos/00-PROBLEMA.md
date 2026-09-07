# Que estaba roto, deducido de lo que se construyo

Este documento se escribe hacia atras, desde lo que existe. La cadena de
inferencia es debil y va escrita como tal.

## Que se construyo, y que problema sugiere

El repositorio automatiza la produccion de material audiovisual y su
publicacion. Por un lado hay guiones que lanzan la generacion de piezas contra
un servicio externo y las traen de vuelta [scripts/gen_galeria.py], consultan
en que estado va cada una [scripts/artifact_status.py], las incorporan al
proyecto dejando constancia de su huella [scripts/ingest_media.py] y las
recodifican para que pesen menos [scripts/optimizar_galeria.py]. Por otro hay
un sitio que publica el resultado y explica el procedimiento
[frontend/src/App.jsx].

[INFERIDO] Habia un problema de peso de los archivos, y era serio: existe un
guion dedicado exclusivamente a recodificar video, audio e imagen y a apartar
los originales [scripts/optimizar_galeria.py], y ademas una comprobacion previa
a publicar [frontend/scripts/check-publish.mjs]. Nadie escribe esas dos piezas
si el material entra sin problema tal como llega.

[INFERIDO] Habia un problema de repetibilidad del procedimiento, no solo de
archivos: el sitio publicado esta organizado como una guia paso a paso, con
secciones de requisitos [frontend/src/content/Requisitos.jsx], instalacion
[frontend/src/content/Instalacion.jsx], acceso
[frontend/src/content/Login.jsx], carga de fuentes
[frontend/src/content/Ingesta.jsx], estado y descarga
[frontend/src/content/EstadoYDescarga.jsx] y resolucion de problemas
[frontend/src/content/Troubleshooting.jsx]. Que se documente hasta ese nivel
sugiere que el procedimiento fallaba al repetirlo.

[INFERIDO] Y habia un problema de separacion entre lo que se puede publicar y
lo que no. Hay un guion cuyo unico trabajo es armar un documento aparte con lo
que no debe quedar visible, consultando ademas que rutas estan excluidas del
control de versiones [scripts/gen_private_doc.py]. Ese guion existe porque el
repositorio es publico, y la evidencia lo confirma en su propia descripcion.

## Quien sufre el problema

[PENDIENTE] El codigo no distingue roles. No hay autenticacion propia, ni
guards, ni tabla de permisos: lo que hay es un perfil de sesion contra un
servicio externo, tomado de una variable de entorno
[scripts/gen_private_doc.py:282].

[INFERIDO] Hay al menos dos posiciones distintas frente a este repositorio, y
estan separadas por una linea explicita: quien opera la herramienta, que
necesita credenciales y sigue la guia de acceso
[frontend/src/content/Login.jsx], y quien solo consume el material publicado
[frontend/src/content/GaleriaVideos.jsx]. El codigo separa esos dos mundos por
lo que publica, no por permisos.

[PENDIENTE] Cuantas personas operan la herramienta y cuantas consultan el
resultado.

## Como lo resolvian antes

[INFERIDO] Antes se hacia a mano y con herramientas de escritorio, pieza por
pieza. Todo el proceso de video esta escrito como guiones sueltos que se
disparan uno a uno: tomar capturas de pantalla
[video/pipeline/capturar.py], recorrer las vistas a capturar
[video/pipeline/capturar_todo.py], generar la narracion
[video/pipeline/narrar.py], generar la musica [video/pipeline/musica.py] y
medir la imagen resultante [video/pipeline/medir_datos.py], mas un guion de
concha que los encadena [video/pipeline/rehacer.sh].

[INFERIDO] Hubo una etapa de prueba de voces y ritmos hecha a oido, conservada
en el repositorio como archivos de muestra
[video/muestra-voces-A-sin-enfasis.mp3]
[video/muestra-voces-B-con-enfasis.mp3] [video/ritmo-A-actual.mp3]
[video/ritmo-B-conversacional.mp3].

[PENDIENTE] Quien producia este material antes, con que herramienta y cuanto
tardaba en cada pieza.

## Que pasa si no se hace nada

[PENDIENTE], sin excepcion.

## Volumen

[INFERIDO] El orden de magnitud es de decenas de piezas, no de miles: en el
directorio publicado hay seis audios
[frontend/public/galeria/audio/audio-00-parques-nacionales-web.m4a], quince
infografias con su miniatura
[frontend/public/galeria/infographic/info-00-parques-nacionales.webp]
[frontend/public/galeria/infographic/info-00-parques-nacionales-thumb.webp] y
once videos con su imagen de portada
[frontend/public/galeria/video/video-00-parques-nacionales-web.mp4]
[frontend/public/galeria/video/video-00-parques-nacionales-poster.webp]. La
cuenta sale del propio listado de archivos.

[INFERIDO] El peso, y no la cantidad, es lo que obliga: cada pieza existe en
version optimizada para publicar, y el guion que hace esa conversion aparta los
originales fuera de lo publicado [scripts/optimizar_galeria.py]. Las cifras de
peso que declara el texto del repositorio no se verifican leyendo codigo y
quedan como [PENDIENTE].

## Quien decide que esta terminado

[PENDIENTE], sin excepcion. Existe un archivo que guarda el estado de la
generacion [galeria-estado.json] y un guion que lo consulta y actualiza
[scripts/gen_galeria.py], pero ese estado es del proceso tecnico, no una
aprobacion de contenido.

## Marco normativo

[VERIFICAR] Hay archivos de creditos de imagenes, en cuatro versiones
sucesivas [presentacion/creditos-imagenes-v2.csv]
[presentacion/creditos-imagenes-v5.csv]. Que exista un registro de creditos
indica que alguien se preocupo de la procedencia y los derechos del material
grafico; si esa atribucion es suficiente, y para que uso, no se resuelve
leyendo codigo.

[VERIFICAR] La herramienta que sostiene todo el flujo se declara en el
manifiesto como una dependencia de version fija [requirements.txt:6], y el
propio texto del repositorio advierte que no es un cliente oficial del servicio
que consume [README.md]. Las condiciones de uso de ese servicio, y si permiten
este tipo de acceso, las tiene que cerrar quien corresponda.

[VERIFICAR] El material publicado se genero a partir de fuentes externas
descritas en el texto del repositorio [README.md]. La licencia de esas fuentes
y del material derivado no esta declarada en ningun archivo de la evidencia.
