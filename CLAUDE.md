# CLAUDE.md — coipo_notebooklm

Guía para agentes. Uso en `README.md`; problema y solución (derivados del código) en `insumos/00-PROBLEMA.md` y `insumos/01-SOLUCION.md`.

## Qué es
Puente con **NotebookLM** (cliente no oficial `notebooklm-mcp-cli==0.9.10`, comando `nlm` y servidor MCP `notebooklm`) para generar
audios, vídeos e infografías, traerlos al repo con metadata y publicarlos en un sitio React (galería + guía paso a paso).
Además contiene `video/`, un proyecto Remotion + pipeline Python que produce vídeos explicativos de otros sistemas COIPO.
El repositorio es **público**.

## Estructura
- `frontend/`: sitio React 19 + Vite 8 (`src/content/` secciones, `src/data/galeria.js` generado, `scripts/check-publish.mjs`).
- `scripts/`: `gen_galeria.py`, `optimizar_galeria.py`, `ingest_media.py`, `artifact_status.py`, `gen_private_doc.py`, `gen_conaf.py`.
- `media/` (manifiesto versionado, binarios ignorados), `image/`, `galeria-estado.json`, `presentacion/*.csv`, `forestin/`.
- `video/`: `src/` (composiciones Remotion), `pipeline/` (Python y `rehacer.sh`), `public/` (entradas), `diseno/`.
- `.mcp.json` (servidor `notebooklm` por stdio, usa `.venv\Scripts\notebooklm-mcp.exe`), `requirements.txt`, `skills-lock.json`.
- `.github/workflows/deploy.yml`: publica `frontend/` en GitHub Pages en cada push a `main`.

## Comandos (existen en el repo)
- Entorno Python: `python -m venv .venv` y `.\.venv\Scripts\python.exe -m pip install -r requirements.txt`; `.\.venv\Scripts\nlm.exe login`.
- Sitio: `cd frontend && npm install && npm run dev | lint | build | check:publish` (`VITE_BASE=/coipo_notebooklm/` para Pages).
- Galería: `scripts\gen_galeria.py --plan | --ciclo | --adoptar`, luego `scripts\optimizar_galeria.py`.
- Vídeos: `cd video && npm install && npm run studio`; render con `npx remotion render src/index.jsx <Catastro|ContratoPod|EcosistemaPod>`.
- No hay suite de pruebas. No ejecuté nada de esto al escribir el documento.

## Convenciones
Español. Los scripts son reanudables y verifican lo generado; `media/manifest.json` guarda sha256, duración y códec.
`frontend/src/data/galeria.js` es generado: no se edita a mano.

## Trampas
- **Secretos:** `docs/CONEXION-PRIVADA.*` contiene cookies de sesión de Google y está ignorado por git; no quitar esas reglas ni copiar su contenido a ningún documento. Correr `npm run check:publish` antes de publicar.
- `nlm status artifacts` está roto en 0.9.10: usar `scripts/artifact_status.py`.
- La cuenta usa `notebook.google.com`: con `NOTEBOOKLM_COOKIES` hace falta también `NOTEBOOKLM_BASE_URL`.
- Cuota de infografías: ~15 y bloqueo de más de doce horas.
- Todo lo de `frontend/public/` acaba en `dist/`: los originales pesados van a `media/galeria/` (ignorado).
- `video/pipeline/narrar.py` trae una ruta absoluta del equipo del autor; los MP4 de `video/` se ignoran salvo `public/clips/`.
- `npm run render` de `video/package.json` apunta a `Explicativo`, no a las piezas actuales.
- `readme_context/` y `README_CANDIDATE.md` son restos del generador automático de README (ya retirado del CI); no son documentación vigente.

## No tocar
Cookies y perfil `~/.notebooklm-mcp-cli`; `.gitignore` en lo que protege lo privado; `skills-lock.json` salvo con `npx skills`.
