# Que se construyo

## Que hace

Son tres cosas que conviven en un mismo repositorio y conviene no mezclarlas.

La primera: permite encargar piezas de material a un servicio externo, seguir
en que estado va cada encargo, recuperarlas cuando estan listas y dejarlas
incorporadas al proyecto. El encargo y la recuperacion los hace un guion que
mantiene su propio estado entre corridas [scripts/gen_galeria.py]; la consulta
de estado esta separada [scripts/artifact_status.py]; la incorporacion registra
para cada archivo su duracion, su formato y su huella criptografica
[scripts/ingest_media.py]; y la reduccion de peso, con separacion entre lo
publicado y el original, la hace un cuarto guion
[scripts/optimizar_galeria.py].

La segunda: publica un sitio que sirve a la vez de guia del procedimiento y de
galeria del resultado. La guia recorre que es la herramienta
[frontend/src/content/QueEs.jsx], que hace falta para usarla
[frontend/src/content/Requisitos.jsx], como se instala
[frontend/src/content/Instalacion.jsx], como se accede
[frontend/src/content/Login.jsx], como se cargan las fuentes
[frontend/src/content/NotebookYFuentes.jsx] [frontend/src/content/Ingesta.jsx],
como se consulta el estado y se descarga
[frontend/src/content/EstadoYDescarga.jsx], que clientes se pueden conectar
[frontend/src/content/ClientesMcp.jsx], que variables de entorno intervienen
[frontend/src/content/VariablesEntorno.jsx] y que hacer cuando falla
[frontend/src/content/Troubleshooting.jsx]. La galeria separa audios
[frontend/src/content/GaleriaAudios.jsx], infografias
[frontend/src/content/GaleriaInfografias.jsx] y videos
[frontend/src/content/GaleriaVideos.jsx], con filtro por tema
[frontend/src/components/FiltroTemas.jsx] y visor ampliado
[frontend/src/components/Lightbox.jsx].

La tercera: produce videos explicativos por codigo, no por edicion manual. Hay
composiciones declaradas [video/src/Root.jsx] con varias piezas distintas
[video/src/Explicativo.jsx] [video/src/VideoContrato.jsx]
[video/src/VideoEcosistema.jsx] [video/src/v2/VideoCatastro.jsx], un sistema de
estilo compartido [video/src/estilo.js] [video/src/v2/base.jsx] y un motor de
escenas [video/src/v2/motor.jsx]. Los insumos de esos videos se generan
tambien por codigo: capturas de pantalla tomadas de forma automatizada
[video/pipeline/capturar.py] [video/pipeline/capturar_todo.py], encuadres
geograficos calculados [video/pipeline/encuadres.py], narracion sintetizada
[video/pipeline/narrar.py] y sincronizada por tiempos
[video/pipeline/narrar_beats.py], musica [video/pipeline/musica.py] y una
comprobacion de que la imagen quedo como se esperaba
[video/pipeline/medir_datos.py].

## Roles: quien ve que

[PENDIENTE] No hay roles ni autorizacion en el codigo. No hay guards,
decoradores, middleware ni tabla de permisos en toda la evidencia.

[INFERIDO] Lo que si existe es una separacion deliberada entre lo publico y lo
privado, resuelta por publicacion y no por permisos: el repositorio es publico,
y hay un guion cuyo unico proposito es armar aparte el documento con lo que no
debe quedar visible, consultando ademas las reglas de exclusion del control de
versiones [scripts/gen_private_doc.py]. Hay ademas una comprobacion previa a
publicar el sitio [frontend/scripts/check-publish.mjs].

[INFERIDO] La sesion contra el servicio externo se identifica por un perfil
nombrado en una variable de entorno [scripts/gen_private_doc.py:282]; el
repositorio no guarda esa sesion, y la guia de acceso lo trata como un paso
manual del operador [frontend/src/content/Login.jsx].

[PENDIENTE] Quien puede operar la herramienta y quien autoriza publicar una
pieza en la galeria.

## De donde salen los datos

[INFERIDO] El material publicado no se produce aqui: lo genera un servicio
externo al que se llega por un cliente declarado con version fija
[requirements.txt:6], configurado como servidor de herramientas [.mcp.json].

[INFERIDO] El estado de lo generado se guarda en un archivo del repositorio
[galeria-estado.json], leido y escrito por el guion de generacion
[scripts/gen_galeria.py], y el catalogo que muestra el sitio esta declarado
como datos del frontend [frontend/src/data/galeria.js], junto con los tipos de
artefacto [frontend/src/data/artifacts.js], las variables de entorno que se
documentan [frontend/src/data/envVars.js] y los clientes compatibles
[frontend/src/data/mcpClients.js].

[INFERIDO] Los archivos incorporados quedan registrados con huella
criptografica y metadatos tecnicos en un manifiesto propio
[media/manifest.json], producido por el guion de incorporacion
[scripts/ingest_media.py].

[INFERIDO] Los videos explicativos se alimentan de capturas de pantalla de
otras aplicaciones [video/pipeline/capturas/01_nacional.png]
[video/public/catastro/01_nacional.png], de material de video de archivo
[video/public/clips/bosque_aereo.mp4], de fotografias
[video/public/foto2.jpg] y de narraciones sintetizadas
[video/public/narracion.mp3], mas guiones escritos como codigo
[video/pipeline/guion_catastro.py] [video/pipeline/guion_contrato2.py].

[PENDIENTE] Quien es dueno de las fuentes cargadas en el servicio externo,
quien es dueno de las imagenes de archivo y con que licencia se usan.

## Que NO hace

Ausencias afirmables porque el analizador recorrio esas categorias de forma
exhaustiva. Van marcadas igual.

[INFERIDO] No tiene servidor propio ni interfaz de programacion: la extraccion
no registro ningun endpoint servido en todo el repositorio.

[INFERIDO] No tiene base de datos: no se registro ninguna tabla. El estado
persiste en archivos del propio repositorio [galeria-estado.json]
[media/manifest.json].

[INFERIDO] No genera el contenido: lo encarga. Todo lo que hace el codigo
alrededor del material es pedirlo, seguirlo, traerlo, comprimirlo y publicarlo
[scripts/gen_galeria.py] [scripts/optimizar_galeria.py].

[INFERIDO] El sitio publicado no recibe datos de quien lo visita: no hay
formulario, no hay envio y no hay endpoint al que enviar. Es material estatico
construido y desplegado por un flujo automatico
[.github/workflows/deploy.yml].

## Iteraciones

[INFERIDO] Hubo al menos dos generaciones del sistema de video, y conviven: las
composiciones de la primera estan en la raiz del codigo
[video/src/VideoContrato.jsx] [video/src/VideoEcosistema.jsx] y las de la
segunda en un directorio aparte [video/src/v2/VideoContrato2.jsx]
[video/src/v2/VideoEcosistema2.jsx], con su propio motor
[video/src/v2/motor.jsx] y su propio lenguaje visual
[video/src/v2/arquetipos.jsx].

[INFERIDO] Los creditos de imagenes llevan cuatro versiones sucesivas
[presentacion/creditos-imagenes-v2.csv]
[presentacion/creditos-imagenes-v3.csv]
[presentacion/creditos-imagenes-v4.csv]
[presentacion/creditos-imagenes-v5.csv], lo que indica al menos cuatro pasadas
sobre el mismo material.

[INFERIDO] Hay un documento propio sobre como afinar la generacion
[generacion_optima.md] y un archivo que fija las versiones de las capacidades
usadas [skills-lock.json]. No hay CHANGELOG ni etiquetas de version en la
evidencia.
