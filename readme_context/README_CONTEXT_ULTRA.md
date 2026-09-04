# PROJECT EVIDENCE CONTEXT
PROJECT=target
FILES=307
GENERATED=2026-09-04T12:53:08.178833

## EVIDENCE_POLICY

This context contains repository evidence.
Signals are not guaranteed business features.
Do not infer unsupported functionality.
Prefer explicit files, dependencies and source evidence.
If evidence is insufficient, omit the claim.

## STACK
LANG=React,Python,JSON,JavaScript,Markdown,HTML,CSS,YAML,Text,Shell
TECH=Docker[medium],FastAPI[medium],Leaflet[medium],Node.js[high],NumPy[low],OpenCV[medium],PostgreSQL[medium],React[high],Tailwind[medium],Vite[high],Vue[medium]

## PYTHON_DEPENDENCIES
notebooklm-mcp-cli==0.9.10

## STRUCTURE
ROOTS=video(160),frontend(116),scripts(6),image(4),presentacion(4),readme_context(3),media(2),.github(2),generacion_optima.md(1),requirements.txt(1),.gitattributes(1),.mcp.json(1),.gitignore(1),galeria-estado.json(1),README.md(1),skills-lock.json(1),README_CANDIDATE.md(1),forestin(1)

## KEY_FILES
frontend/package.json,requirements.txt,video/package.json,README.md,frontend/.env.example,frontend/README.md,frontend/package-lock.json,video/package-lock.json,.github/workflows/deploy.yml,frontend/vite.config.js,.github/workflows/readme.yml,frontend/src/content/Login.jsx,frontend/src/router/useHashRoute.js,video/remotion.config.js,video/src/index.jsx

## ENV_EVIDENCE
NLM_PROFILE [scripts/gen_private_doc.py:282]

## CAPABILITY_SIGNALS
Autenticación [confidence=medium]
  login [generacion_optima.md:225]
  login [requirements.txt:5]
  login [README.md:15]
  auth [README.md:62]
  login [README_CANDIDATE.md:15]
  auth [README_CANDIDATE.md:62]
  login [frontend/index.html:10]
  jwt [frontend/package-lock.json:307]
Mapas / cartografía [confidence=medium]
  mapa [frontend/src/data/artifacts.js:16]
  mapa [frontend/src/content/QueEs.jsx:59]
  leaflet [readme_context/README_CONTEXT_ULTRA.md:16]
  mapa [readme_context/README_CONTEXT_ULTRA.md:40]
  leaflet [readme_context/README_EVIDENCE.json:2452]
  mapa [readme_context/README_EVIDENCE.json:2618]
  mapa [video/diseno/Estructura.dc.html:142]
  mapa [video/diseno/Arquetipos.dc.html:165]
Exportación [confidence=medium]
  export [generacion_optima.md:353]
  csv [generacion_optima.md:384]
  excel [generacion_optima.md:195]
  export [frontend/.oxlintrc.json:6]
  export [frontend/vite.config.js:18]
  export [frontend/src/App.jsx:17]
  export [frontend/src/router/useHashRoute.js:20]
  export [frontend/src/hooks/useCopyToClipboard.js:10]
Carga de archivos [confidence=medium]
  archivo [generacion_optima.md:35]
  file [generacion_optima.md:116]
  archivo [galeria-estado.json:23]
  archivo [README.md:85]
  file [README.md:12]
  document [README.md:11]
  archivo [README_CANDIDATE.md:85]
  file [README_CANDIDATE.md:12]
Reportes / analítica [confidence=medium]
  report [README.md:3]
  reporte [README.md:3]
  report [README_CANDIDATE.md:3]
  reporte [README_CANDIDATE.md:3]
  report [frontend/src/data/artifacts.js:13]
  reporte [frontend/src/data/artifacts.js:13]
  report [frontend/src/content/QueEs.jsx:10]
  reporte [frontend/src/content/QueEs.jsx:10]
Procesamiento de datos [confidence=medium]
  etl [frontend/vite.config.js:6]
  etl [readme_context/README_CONTEXT_ULTRA.md:77]
  etl [readme_context/README_EVIDENCE.json:2947]
  etl [video/package-lock.json:2359]
  etl [video/pipeline/catalogo.py:55]
  etl [video/pipeline/encuadres.py:8]
  numpy [video/pipeline/medir_datos.py:17]
  numpy [video/pipeline/hacer_cuaderno.py:220]
IA / Machine Learning [confidence=low]
  tensorflow [video/pipeline/hacer_cuaderno.py:144]
  torch [video/pipeline/hacer_cuaderno.py:69]

## PYTHON
scripts/gen_galeria.py|F=plan,cargar_estado,guardar_estado,nlm,lanzar,crear,estado_remoto,adoptar,revisar_y_descargar,ciclo,escribir_manifiesto,main|I=argparse,json,subprocess,sys,time,pathlib,notebooklm_tools.cli.commands.studio,notebooklm_tools.services,dataclasses
scripts/gen_private_doc.py|F=git_ignores,load_profile,build_document,main|I=argparse,json,os,subprocess,sys,pathlib,notebooklm_tools.core.auth,notebooklm_tools.mcp.tools._utils,notebooklm_tools.utils.browser,notebooklm_tools.utils.config
scripts/optimizar_galeria.py|F=ffmpeg,a_webp,recodificar_video,recodificar_audio,apartar,poster,kb,main|I=json,shutil,subprocess,sys,pathlib
scripts/gen_conaf.py|F=nlm,cargar_estado,guardar_estado,args_de,crear,descargar,main|I=argparse,json,subprocess,sys,time,pathlib
scripts/ingest_media.py|F=ffprobe,sha256,main|I=argparse,hashlib,json,shutil,subprocess,sys,datetime,pathlib
scripts/artifact_status.py|F=snapshot,main|I=argparse,dataclasses,json,sys,time,notebooklm_tools.cli.commands.studio,notebooklm_tools.services
video/pipeline/capturar_todo.py|F=preparar,cargar,plano|I=time,capturar,capturar
video/pipeline/catalogo.py|F=main|I=io,json,os,sys
video/pipeline/narrar_beats.py|F=trozos,hueco,sala,pcm,silencio,recortar,principal|I=array,asyncio,importlib,io,json,os,subprocess,sys,tempfile,edge_tts,random,array
video/pipeline/encuadres.py|F=_merc,encuadrar,cargar,nacional,region,query|I=io,json,math,os
video/pipeline/capturar.py|C=Cdp|F=lanzar,esperar_carga,inventario,__init__,enviar,js,retina,foto,cerrar|I=base64,io,json,os,subprocess,sys,tempfile,time,requests,websocket
video/pipeline/musica.py|F=main,sine|I=io,os,subprocess,sys
video/pipeline/medir_datos.py|F=rgb,caja|I=io,json,os,sys,numpy,PIL
video/pipeline/capturar_catastro.py|F=ir,plano,escape|I=sys,time,capturar,capturar_todo,encuadres
video/pipeline/capturar_modales.py|F=escape,panel_abierto,asegurar_panel|I=time,capturar,capturar_todo
video/pipeline/narrar.py|F=duracion,main|I=asyncio,importlib,io,json,os,subprocess,sys,edge_tts
video/pipeline/hacer_cuaderno.py|F=md,code,comprobar|I=ast,io,json,os

## COMPONENTS
frontend/src/App.jsx:NAV_ID,SITE,App,Section
frontend/src/hooks/platformContext.js:STORAGE_KEY,PlatformContext
frontend/src/data/mcpClients.js:MCP_CLIENTS
frontend/src/data/galeria.js:GALERIA
frontend/src/data/envVars.js:ENV_VARS
frontend/src/data/artifacts.js:AUDIO_FORMATS,ARTIFACT_TYPES
frontend/src/content/Instalacion.jsx:Instalacion
frontend/src/content/GaleriaInfografias.jsx:GaleriaInfografias
frontend/src/content/Troubleshooting.jsx:Troubleshooting
frontend/src/content/Ingesta.jsx:Ingesta
frontend/src/content/EstadoYDescarga.jsx:EstadoYDescarga
frontend/src/content/GaleriaVideos.jsx:GaleriaVideos
frontend/src/content/GaleriaAudios.jsx:DESCRIPCION,GaleriaAudios
frontend/src/content/Requisitos.jsx:Requisitos
frontend/src/content/VariablesEntorno.jsx:VariablesEntorno
frontend/src/content/Login.jsx:Login
frontend/src/content/NotebookYFuentes.jsx:NotebookYFuentes
frontend/src/content/QueEs.jsx:QueEs
frontend/src/content/ClientesMcp.jsx:ClientesMcp
frontend/src/content/sections.js:SECTIONS,SLUGS,GROUPS
frontend/src/content/OtrosProyectos.jsx:OtrosProyectos
frontend/src/content/Multimedia.jsx:Multimedia
frontend/src/components/Badge.jsx:Badge
frontend/src/components/SectionContext.js:SectionContext
frontend/src/components/PagerNav.jsx:PagerNav
frontend/src/components/Steps.jsx:Steps,Step
frontend/src/components/TopBar.jsx:TopBar
frontend/src/components/Lightbox.jsx:Lightbox
frontend/src/components/PlatformProvider.jsx:PlatformProvider
frontend/src/components/CopyButton.jsx:LABELS,CopyButton
frontend/src/components/Heading.jsx:Anchor,H2,H3
frontend/src/components/NotFound.jsx:NotFound
frontend/src/components/Callout.jsx:PREFIX,PATH,Callout
frontend/src/components/DataTable.jsx:DataTable
frontend/src/components/TableOfContents.jsx:TableOfContents
frontend/src/components/Sidebar.jsx:Sidebar
frontend/src/components/FiltroTemas.jsx:FiltroTemas
frontend/src/components/CodeBlock.jsx:CodeBlock
video/src/secciones2.jsx:Fondo,Roles,Datos,Cifras
video/src/VideoContrato.jsx:FPS,SECCIONES,TOTAL_S,DURACION_FRAMES,Velo,VideoContrato
video/src/secciones.jsx:Fondo,Portada,Icono,Problema,Flujo
video/src/animacion.js:FPS
video/src/VideoEcosistema.jsx:FPS,LISTA,TOTAL_S,DURACION_FRAMES,Velo,VideoEcosistema
video/src/Root.jsx:RemotionRoot
video/src/Portadilla.jsx:DUR_PORTADILLA,Portadilla
video/src/estilo.js:C,FUENTE,FPS,Antetitulo
video/src/contrato.jsx:Titulo,QueEs,Problema,ESTADOS,Estados,Plantillas,Bandeja,Seguridad,Infraestructura,Cierre
video/src/Explicativo.jsx:FPS,SECCIONES,TOTAL_S,DURACION_FRAMES,Velo,Explicativo
video/src/ecosistema.jsx:FAM,Apertura,Familia,CierreEco
video/src/v2/base.jsx:T,SERIF,SANS,Fuentes,Grano,Vineta,Metraje,Rotulo,Declara,Parrafo
video/src/v2/escenas.jsx:Rot,Titular,Cifra,Lista,Pasos,Familia,Mapa,PASOS,EscenaContrato,COLOR,F,FAMILIAS,EscenaEcosistema
video/src/v2/arquetipos.jsx:Declaracion,Numeral,Partido,Recorrido,Constelacion,Indice,Familia
video/src/v2/VideoContrato2.jsx:FPS,Gancho,QueEs,Problema,Remate1,PASOS,Estados,Remate2,Plantillas,Bandeja,Seguridad,Infra,Cierre,LISTA,DURACION_FRAMES
video/src/v2/motor.jsx:FPS,BANDA,ALTO_ESCENA,VOZ,Pie,Avance,Escenario,Podcast
video/src/v2/VideoCatastro.jsx:FPS,DURACION_FRAMES,BEATS,BANDA,ALTO_IMAGEN,CENTRO_Y,ZONAS,VOZ,Captura,Plano,Camara,Pie,Avance,VideoCatastro
video/src/v2/VideoEcosistema2.jsx:FPS,COLOR,F,Gancho,Apertura,Remate,Cierre,LISTA,DURACION_FRAMES,Corte,VideoEcosistema2
video/src/v2/VideoEcosistemaPod.jsx:DURACION_FRAMES,VideoEcosistemaPod
video/src/v2/VideoContratoPod.jsx:DURACION_FRAMES,VideoContratoPod

## EXISTING_README
# coipo_notebooklm
Puente entre **NotebookLM** y este repositorio: generar artefactos multimedia (Audio Overview, Video Overview, infografías, reportes) desde el CLI o desde Claude Code vía MCP, y traerlos al proyecto con metadata verificable.
## Estado de la conexión
| Pieza | Detalle |
|---|---|
| Cliente | [`notebooklm-mcp-cli`](https://github.com/jacob-bd/notebooklm-mcp-cli) 0.9.10 (no oficial) |
| Entorno | `.venv/` del proyecto (no toca tu base de conda) |
| Cuenta | Cuenta corporativa de Google, perfil `default`. El correo concreto está en el documento privado, no aquí: este repositorio es público. |
| Credenciales | `~/.notebooklm-mcp-cli/profiles/default` (cookies del navegador — **no** están en el repo) |
| MCP | `.mcp.json` → servidor `notebooklm` (stdio) |
> **Advertencia.** No existe API pública oficial de NotebookLM. Este cliente usa interfaces internas de Google (Boq RPC) y autenticación por cookies de sesión. Google puede romperlo o exigir un nuevo login sin aviso. La alternativa oficial ...
## Documentación
| Documento | Audiencia | Contenido |
|---|---|---|
| [frontend/](frontend/) | **Pública** — se publica | Guía paso a paso navegable + galería de artefactos. Sin credenciales de ningún tipo. |
| `docs/CONEXION-PRIVADA.md` | **Privada** — nunca sale del equipo | Cuenta, rutas del perfil y valores literales de cookies para conectar otros proyectos. |
## Galería: bosques y áreas protegidas de Chile
El sitio publica **32 artefactos** generados con NotebookLM desde el notebook [Bosques y áreas protegidas de Chile](https://notebooklm.google.com/notebook/585db228-fcfa-46ea-85ca-68f9a8cf6f51) (8 fuentes públicas: parques nacionales, CONAF,...
| | Cantidad | Peso publicado |
|---|---|---|
| Infografías | 15 | 5,4 MB (WebP 1600 px + miniatura 640 px) |
| Vídeos | 11 | 64 MB (H.264 CRF 30 + póster WebP) |
| Audios | 6 | 35 MB (AAC 96 kbps) |
Los originales pesaban **515 MB**; publicados son **103 MB**. Los originales se apartan a `media/galeria/`, que git ignora, porque todo lo que hay en `frontend/public/` acaba copiado en `dist/`.
```powershell
.\.venv\Scripts\python.exe scripts\gen_galeria.py --plan      # ver el plan
.\.venv\Scripts\python.exe scripts\gen_galeria.py --ciclo     # generar y descargar (reanudable)
.\.venv\Scripts\python.exe scripts\gen_galeria.py --adoptar   # registrar artefactos fuera de plan
.\.venv\Scripts\python.exe scripts\optimizar_galeria.py       # WebP/recodificar + manifiesto
```
> **Cuota.** NotebookLM corta la creación de infografías tras unas 15 y el bloqueo dura **más de doce horas**. Es por cuenta, no por notebook, y cada tipo de artefacto lleva su propio contador (con infografías bloqueadas, vídeos y audios se...
El documento privado **no está en el repositorio** y no debe estarlo: lo ignoran `.gitignore` y `.git/info/exclude`. Se genera bajo demanda, porque las cookies rotan solas y cualquier copia manual queda obsoleta:
```powershell
.\.venv\Scripts\python.exe scripts\gen_private_doc.py
```

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