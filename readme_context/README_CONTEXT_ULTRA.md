# PROJECT EVIDENCE CONTEXT
PROJECT=target
FILES=233
GENERATED=2026-09-03T01:38:54.981461

## EVIDENCE_POLICY

This context contains repository evidence.
Signals are not guaranteed business features.
Do not infer unsupported functionality.
Prefer explicit files, dependencies and source evidence.
If evidence is insufficient, omit the claim.

## STACK
LANG=React,JavaScript,Python,JSON,HTML,CSS,Markdown,YAML,Text
TECH=Docker[low],FastAPI[medium],Leaflet[low],Node.js[high],OpenCV[low],PostgreSQL[medium],React[high],Tailwind[low],Vite[high],Vue[low]

## PYTHON_DEPENDENCIES
notebooklm-mcp-cli==0.9.10

## STRUCTURE
ROOTS=frontend(116),video(91),scripts(6),presentacion(4),image(4),.github(2),media(2),.gitignore(1),.gitattributes(1),generacion_optima.md(1),galeria-estado.json(1),README.md(1),requirements.txt(1),.mcp.json(1),forestin(1)

## KEY_FILES
frontend/package.json,requirements.txt,video/package.json,README.md,frontend/.env.example,frontend/README.md,frontend/package-lock.json,video/package-lock.json,.github/workflows/deploy.yml,frontend/vite.config.js,.github/workflows/readme.yml,frontend/src/content/Login.jsx,frontend/src/router/useHashRoute.js,video/remotion.config.js,video/src/index.jsx

## ENV_EVIDENCE
NLM_PROFILE [scripts/gen_private_doc.py:282]

## CAPABILITY_SIGNALS
Autenticación [confidence=medium]
  login [generacion_optima.md:225]
  login [README.md:19]
  auth [README.md:82]
  login [requirements.txt:5]
  token [video/package-lock.json:25]
  auth [video/src/contrato.jsx:275]
  jwt [video/src/contrato.jsx:275]
  token [video/src/contrato.jsx:275]
Mapas / cartografía [confidence=medium]
  mapa [video/diseno/Estructura.dc.html:142]
  mapa [video/diseno/Arquetipos.dc.html:165]
  leaflet [video/src/beats_catastro.json:729]
  mapa [video/src/beats_catastro.json:14]
  mapa [video/src/ecosistema.jsx:20]
  mapa [video/src/v2/VideoCatastro.jsx:24]
  mapa [video/src/v2/VideoEcosistema2.jsx:61]
  leaflet [video/pipeline/guion_catastro.py:186]
Exportación [confidence=medium]
  export [generacion_optima.md:353]
  csv [generacion_optima.md:384]
  excel [generacion_optima.md:195]
  export [video/src/animacion.js:6]
  export [video/src/estilo.js:4]
  export [video/src/Explicativo.jsx:7]
  export [video/src/secciones2.jsx:25]
  excel [video/src/secciones2.jsx:43]
Carga de archivos [confidence=medium]
  archivo [generacion_optima.md:35]
  file [generacion_optima.md:116]
  archivo [galeria-estado.json:23]
  archivo [README.md:107]
  file [README.md:14]
  document [README.md:13]
  file [video/package-lock.json:4]
  file [video/diseno/canvas.json:3]
Reportes / analítica [confidence=medium]
  report [README.md:4]
  reporte [README.md:4]
  dashboard [video/src/catalogo.json:8]
  dashboard [video/pipeline/catalogo.py:14]
  report [frontend/src/content/QueEs.jsx:10]
  reporte [frontend/src/content/QueEs.jsx:10]
  report [frontend/src/data/artifacts.js:13]
  reporte [frontend/src/data/artifacts.js:13]
Procesamiento de datos [confidence=medium]
  etl [video/package-lock.json:2359]
  etl [video/src/catalogo.json:162]
  etl [video/pipeline/catalogo.py:55]
  etl [frontend/vite.config.js:6]

## PYTHON
video/pipeline/capturar_todo.py|F=preparar,cargar,plano|I=time,capturar,capturar
video/pipeline/capturar_modales.py|F=escape,panel_abierto,asegurar_panel|I=time,capturar,capturar_todo
video/pipeline/narrar.py|F=duracion,main|I=asyncio,importlib,io,json,os,subprocess,sys,edge_tts
video/pipeline/capturar.py|C=Cdp|F=lanzar,esperar_carga,inventario,__init__,enviar,js,retina,foto,cerrar|I=base64,io,json,os,subprocess,sys,tempfile,time,requests,websocket
video/pipeline/catalogo.py|F=main|I=io,json,os,sys
video/pipeline/narrar_beats.py|F=pcm,silencio,recortar,principal|I=asyncio,importlib,io,json,os,subprocess,sys,tempfile,edge_tts,array
video/pipeline/musica.py|F=main,sine|I=io,os,subprocess,sys
scripts/ingest_media.py|F=ffprobe,sha256,main|I=argparse,hashlib,json,shutil,subprocess,sys,datetime,pathlib
scripts/artifact_status.py|F=snapshot,main|I=argparse,dataclasses,json,sys,time,notebooklm_tools.cli.commands.studio,notebooklm_tools.services
scripts/gen_private_doc.py|F=git_ignores,load_profile,build_document,main|I=argparse,json,os,subprocess,sys,pathlib,notebooklm_tools.core.auth,notebooklm_tools.mcp.tools._utils,notebooklm_tools.utils.browser,notebooklm_tools.utils.config
scripts/gen_galeria.py|F=plan,cargar_estado,guardar_estado,nlm,lanzar,crear,estado_remoto,adoptar,revisar_y_descargar,ciclo,escribir_manifiesto,main|I=argparse,json,subprocess,sys,time,pathlib,notebooklm_tools.cli.commands.studio,notebooklm_tools.services,dataclasses
scripts/gen_conaf.py|F=nlm,cargar_estado,guardar_estado,args_de,crear,descargar,main|I=argparse,json,subprocess,sys,time,pathlib
scripts/optimizar_galeria.py|F=ffmpeg,a_webp,recodificar_video,recodificar_audio,apartar,poster,kb,main|I=json,shutil,subprocess,sys,pathlib

## COMPONENTS
video/src/animacion.js:FPS
video/src/estilo.js:C,FUENTE,FPS,Antetitulo
video/src/Explicativo.jsx:FPS,SECCIONES,TOTAL_S,DURACION_FRAMES,Velo,Explicativo
video/src/secciones2.jsx:Fondo,Roles,Datos,Cifras
video/src/VideoContrato.jsx:FPS,SECCIONES,TOTAL_S,DURACION_FRAMES,Velo,VideoContrato
video/src/Root.jsx:RemotionRoot
video/src/VideoEcosistema.jsx:FPS,LISTA,TOTAL_S,DURACION_FRAMES,Velo,VideoEcosistema
video/src/ecosistema.jsx:FAM,Apertura,Familia,CierreEco
video/src/Portadilla.jsx:DUR_PORTADILLA,Portadilla
video/src/secciones.jsx:Fondo,Portada,Icono,Problema,Flujo
video/src/contrato.jsx:Titulo,QueEs,Problema,ESTADOS,Estados,Plantillas,Bandeja,Seguridad,Infraestructura,Cierre
video/src/v2/base.jsx:T,SERIF,SANS,Fuentes,Grano,Vineta,Metraje,Rotulo,Declara,Parrafo
video/src/v2/arquetipos.jsx:Declaracion,Numeral,Partido,Recorrido,Constelacion,Indice,Familia
video/src/v2/VideoCatastro.jsx:FPS,DURACION_FRAMES,BEATS,BANDA,ALTO_IMAGEN,CENTRO_Y,ZONAS,AJUSTE,VOZ,Captura,Plano,Camara,Pie,Avance,VideoCatastro
video/src/v2/VideoContrato2.jsx:FPS,Gancho,QueEs,Problema,Remate1,PASOS,Estados,Remate2,Plantillas,Bandeja,Seguridad,Infra,Cierre,LISTA,DURACION_FRAMES
video/src/v2/VideoEcosistema2.jsx:FPS,COLOR,F,Gancho,Apertura,Remate,Cierre,LISTA,DURACION_FRAMES,Corte,VideoEcosistema2
frontend/src/App.jsx:NAV_ID,SITE,App,Section
frontend/src/content/VariablesEntorno.jsx:VariablesEntorno
frontend/src/content/OtrosProyectos.jsx:OtrosProyectos
frontend/src/content/Troubleshooting.jsx:Troubleshooting
frontend/src/content/GaleriaInfografias.jsx:GaleriaInfografias
frontend/src/content/Instalacion.jsx:Instalacion
frontend/src/content/Ingesta.jsx:Ingesta
frontend/src/content/EstadoYDescarga.jsx:EstadoYDescarga
frontend/src/content/Multimedia.jsx:Multimedia
frontend/src/content/ClientesMcp.jsx:ClientesMcp
frontend/src/content/Requisitos.jsx:Requisitos
frontend/src/content/GaleriaVideos.jsx:GaleriaVideos
frontend/src/content/NotebookYFuentes.jsx:NotebookYFuentes
frontend/src/content/GaleriaAudios.jsx:DESCRIPCION,GaleriaAudios
frontend/src/content/sections.js:SECTIONS,SLUGS,GROUPS
frontend/src/content/QueEs.jsx:QueEs
frontend/src/content/Login.jsx:Login
frontend/src/data/envVars.js:ENV_VARS
frontend/src/data/artifacts.js:AUDIO_FORMATS,ARTIFACT_TYPES
frontend/src/data/galeria.js:GALERIA
frontend/src/data/mcpClients.js:MCP_CLIENTS
frontend/src/hooks/platformContext.js:STORAGE_KEY,PlatformContext
frontend/src/components/PagerNav.jsx:PagerNav
frontend/src/components/Badge.jsx:Badge
frontend/src/components/DataTable.jsx:DataTable
frontend/src/components/TopBar.jsx:TopBar
frontend/src/components/CopyButton.jsx:LABELS,CopyButton
frontend/src/components/CodeBlock.jsx:CodeBlock
frontend/src/components/Heading.jsx:Anchor,H2,H3
frontend/src/components/Steps.jsx:Steps,Step
frontend/src/components/FiltroTemas.jsx:FiltroTemas
frontend/src/components/NotFound.jsx:NotFound
frontend/src/components/Callout.jsx:PREFIX,PATH,Callout
frontend/src/components/Lightbox.jsx:Lightbox
frontend/src/components/SectionContext.js:SectionContext
frontend/src/components/Sidebar.jsx:Sidebar
frontend/src/components/PlatformProvider.jsx:PlatformProvider
frontend/src/components/TableOfContents.jsx:TableOfContents

## EXISTING_README
# coipo_notebooklm
Puente entre **NotebookLM** y este repositorio: generar artefactos multimedia
(Audio Overview, Video Overview, infografías, reportes) desde el CLI o desde
Claude Code vía MCP, y traerlos al proyecto con metadata verificable.
## Estado de la conexión
| Pieza | Detalle |
|---|---|
| Cliente | [`notebooklm-mcp-cli`](https://github.com/jacob-bd/notebooklm-mcp-cli) 0.9.10 (no oficial) |
| Entorno | `.venv/` del proyecto (no toca tu base de conda) |
| Cuenta | Cuenta corporativa de Google, perfil `default`. El correo concreto está en el documento privado, no aquí: este repositorio es público. |
| Credenciales | `~/.notebooklm-mcp-cli/profiles/default` (cookies del navegador — **no** están en el repo) |
| MCP | `.mcp.json` → servidor `notebooklm` (stdio) |
> **Advertencia.** No existe API pública oficial de NotebookLM. Este cliente usa
> interfaces internas de Google (Boq RPC) y autenticación por cookies de sesión.
> Google puede romperlo o exigir un nuevo login sin aviso. La alternativa oficial
> es la API *Gemini Notebook Enterprise* en Google Cloud, que requiere licencia
> enterprise (la creación de audio overviews está en preview Pre-GA).
## Documentación
| Documento | Audiencia | Contenido |
|---|---|---|
| [frontend/](frontend/) | **Pública** — se publica | Guía paso a paso navegable + galería de artefactos. Sin credenciales de ningún tipo. |
| `docs/CONEXION-PRIVADA.md` | **Privada** — nunca sale del equipo | Cuenta, rutas del perfil y valores literales de cookies para conectar otros proyectos. |
## Galería: bosques y áreas protegidas de Chile
El sitio publica **32 artefactos** generados con NotebookLM desde el notebook
[Bosques y áreas protegidas de Chile](https://notebooklm.google.com/notebook/585db228-fcfa-46ea-85ca-68f9a8cf6f51)
(8 fuentes públicas: parques nacionales, CONAF, bosque valdiviano, araucaria,
alerce, Torres del Paine, Conguillío, bosque esclerófilo).
| | Cantidad | Peso publicado |
|---|---|---|
| Infografías | 15 | 5,4 MB (WebP 1600 px + miniatura 640 px) |
| Vídeos | 11 | 64 MB (H.264 CRF 30 + póster WebP) |
| Audios | 6 | 35 MB (AAC 96 kbps) |
Los originales pesaban **515 MB**; publicados son **103 MB**. Los originales se
apartan a `media/galeria/`, que git ignora, porque todo lo que hay en
`frontend/public/` acaba copiado en `dist/`.

## DEPLOYMENT_FILES
.github/workflows/deploy.yml,.github/workflows/readme.yml

## README_RULES

Generate README.md only from repository evidence.
Do not invent features.
Do not invent technologies.
Do not invent endpoints.
Do not invent database tables.
Do not invent environment variables.
Do not invent commands.
Do not infer production architecture from filenames alone.
Treat capability signals as signals, not confirmed features.
Prefer explicit source evidence.
Omit unsupported sections.