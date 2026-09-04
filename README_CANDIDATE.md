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

> **Advertencia.** No existe API pública oficial de NotebookLM. Este cliente usa interfaces internas de Google (Boq RPC) y autenticación por cookies de sesión. Google puede romperlo o exigir un nuevo login sin aviso. La alternativa oficial es la API *Gemini Notebook Enterprise* en Google Cloud, que requiere licencia enterprise (la creación de audio overviews está en preview Pre-GA).

## Documentación

| Documento | Audiencia | Contenido |
|---|---|---|
| [frontend/](frontend/) | **Pública** — se publica | Guía paso a paso navegable + galería de artefactos. Sin credenciales de ningún tipo. |
| `docs/CONEXION-PRIVADA.md` | **Privada** — nunca sale del equipo | Cuenta, rutas del perfil y valores literales de cookies para conectar otros proyectos. |

## Galería: bosques y áreas protegidas de Chile

El sitio publica **32 artefactos** generados con NotebookLM desde el notebook [Bosques y áreas protegidas de Chile](https://notebooklm.google.com/notebook/585db228-fcfa-46ea-85ca-68f9a8cf6f51) (8 fuentes públicas: parques nacionales, CONAF, bosque valdiviano, araucaria, alerce, Torres del Paine, Conguillío, bosque esclerófilo).

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

> **Cuota.** NotebookLM corta la creación de infografías tras unas 15 y el bloqueo dura **más de doce horas**. Es por cuenta, no por notebook, y cada tipo de artefacto lleva su propio contador (con infografías bloqueadas, vídeos y audios seguían aceptándose). Por eso hay 15 infografías y no 30: `--ciclo` es reanudable y retoma donde quedó sin repetir nada.

El documento privado **no está en el repositorio** y no debe estarlo: lo ignoran `.gitignore` y `.git/info/exclude`. Se genera bajo demanda, porque las cookies rotan solas y cualquier copia manual queda obsoleta:

```powershell
.\.venv\Scripts\python.exe scripts\gen_private_doc.py
```

El generador aborta si git no ignora el destino.

### Conectar otro proyecto a esta misma sesión

Dos vías, ambas comprobadas de punta a punta contra la API real:

| Vía | Cómo | Límite |
|---|---|---|
| **A** (recomendada) | `NOTEBOOKLM_MCP_CLI_PATH` apuntando a `~/.notebooklm-mcp-cli` | Solo en esta máquina. A cambio no caduca: resuelve host base y CSRF solo. |
| **B** | `NOTEBOOKLM_COOKIES` **junto a** `NOTEBOOKLM_BASE_URL` | Sirve en otra máquina, pero hay que renovarla cuando roten las cookies. |

> `NOTEBOOKLM_COOKIES` es un override total: descarta el perfil entero, incluido el `base_host`. Esta cuenta está en `notebook.google.com`, no en el host por defecto `notebooklm.google.com`, así que **sin `NOTEBOOKLM_BASE_URL` la vía B falla** con `Authentication expired` aunque las cookies sean válidas.

### Sitio de documentación

```powershell
cd frontend
npm install
npm run dev                       # desarrollo
npm run lint
npm run build                     # produccion, base '/'
npm run check:publish             # gate: aborta si hay credenciales en dist/
$env:VITE_BASE='/coipo_notebooklm/'; npm run build   # GitHub Pages
```

`npm run check:publish` busca **valores** de cookies, correos, rutas locales y UUID reales en `dist/`. Los nombres de cookie y los placeholders de la guía no lo disparan. Pásalo antes de publicar.

## Ejemplo verificado end-to-end

| Paso | Resultado |
|---|---|
| Notebook | `COIPO — Demo NotebookLM` → `378e96f9-2811-42f9-b9b1-527eae936120` |
| Fuente | Wikipedia *Myocastor coypus* → `8109a71f-edf9-4aa1-8c71-06e592982af1` |
| Audio Overview | *"El coipo arrasa los ríos españoles"* → `69b16b0b-c60a-42d1-8183-ae552dc2df79` |
| Archivo | `media/audio/coipo_demo.m4a` — 3.204.485 bytes, AAC-LC 44.1 kHz estéreo, 99,54 s |
| Verificación | decodificación completa (8.779.776 samples, 0 errores); `mean_volume -27.0 dB`, `max_volume -9.8 dB` → voz real, no silencio |

## Uso

Todos los comandos usan el binario del venv:

```powershell
.\.venv\Scripts\nlm.exe notebook list
.\.venv\Scripts\nlm.exe notebook create "Mi notebook" --json
.\.venv\Scripts\nlm.exe source add <notebook-id> --url https://ejemplo.cl --wait --json
.\.venv\Scripts\nlm.exe audio create <notebook-id> --format brief --length short --language es --confirm --json
.\.venv\Scripts\nlm.exe download audio <notebook-id> --id <artifact-id> -o media/audio/salida.m4a
```

Formatos de audio disponibles: `deep_dive`, `brief`, `critique`, `debate`.
Otros artefactos: `nlm video`, `nlm report`, `nlm infographic`, `nlm slides`, `nlm mindmap`, `nlm quiz`, `nlm flashcards`, `nlm data-table`.

### Estado de artefactos

`nlm status artifacts` **está roto en 0.9.10** (`TypeError: '<=' not supported between instances of 'int' and 'OptionInfo'` — el default de Typer se filtra a la capa de servicio). Usa el reemplazo del repo, que llama a la librería directo:

```powershell
.\.venv\Scripts\python.exe scripts\artifact_status.py <notebook-id>
.\.venv\Scripts\python.exe scripts\artifact_status.py <notebook-id> --artifact-id <id> --watch
```

La generación de audio tarda varios minutos; hasta que `audio_url` no deja de ser `null`, `nlm download audio` responde `Error: Download failed for audio.`

### Ingesta al proyecto

```powershell
$env:PYTHONUTF8 = "1"   # si el titulo lleva tildes/em-dash, si no llega mojibake al manifiesto
.\.venv\Scripts\python.exe scripts\ingest_media.py media\audio\archivo.m4a --notebook "Mi notebook" --artifact-id <id>
```

Copia el archivo a `media/<tipo>/`, le saca duración/códec/bitrate con `ffprobe` y actualiza `media/manifest.json`. Los binarios están en `.gitignore`; se versiona solo el manifiesto.

## Uso desde Claude Code (MCP)

`.mcp.json` registra el servidor `notebooklm`. Reinicia Claude Code y aprueba el servidor para que aparezcan sus herramientas (`notebook_list`, `studio_create`, `download_artifact`, `notebook_query`, `cross_notebook_query`, …). A partir de ahí se puede pedir en lenguaje natural: *"genera un audio overview del notebook X y tráelo al proyecto"*.

## Estructura

```
docs/             documentación privada, ignorada por git (se genera, no se edita)
frontend/         sitio público: guía + galería (React + Vite)
  public/galeria/          medios optimizados que sí se publican
  src/data/galeria.js      manifiesto generado, no editar a mano
  scripts/check-publish.mjs   gate de secretos sobre dist/
media/            artefactos descargados (binarios ignorados por git)
  galeria/        originales de la galería en calidad completa
  manifest.json   inventario con sha256, duración, códec, origen
scripts/
  artifact_status.py    estado de artefactos (workaround del bug del CLI)
  gen_galeria.py        orquesta el lote de la galería (reanudable)
  gen_private_doc.py    genera docs/CONEXION-PRIVADA.md desde el perfil real
  ingest_media.py       copia + metadata ffprobe + manifiesto
  optimizar_galeria.py  WebP + recodificación + manifiesto del sitio
sources/          documentos fuente locales para subir a NotebookLM
```

## Renovar credenciales

```powershell
.\.venv\Scripts\nlm.exe login --check
.\.venv\Scripts\nlm.exe login          # vuelve a abrir Chrome
```
