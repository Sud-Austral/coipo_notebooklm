# Informe de ejecución: Documentacion_Sistema2, 2026-11-15

## Punto de partida
No había `docs/Documentacion_Sistema*` ni generador ni prompt v3 en el repositorio: se siguió la sección 2 y el apéndice C
del método. Sistema: sitio estático React 19 + Vite 8 (`frontend/`) con una galería alimentada por scripts de Python.
No hay autenticación ni servidor de aplicación: un solo rol con pantalla, «Usuario».

## Cifras (v1 no existía)
| Concepto | v2 |
|---|---|
| Roles | 1 (Usuario); 1 en «Roles que NO se documentan» (operador de scripts) |
| Funcionalidades | 11 |
| Casos de uso / fichas QA | 12 / 12 + 4 negativas |
| Reglas | 10 |
| Problemas abiertos | 5 (1 alta, 1 media, 3 baja) |
| Capturas | 14 |
| Páginas PDF | Análisis 5, Manual 14, Casos 6, QA 6 |

## Qué verifiqué y cómo
- `frontend/dist` es el código actual: compilé una copia en el scratchpad desde PowerShell y el bundle salió con el mismo hash (`index-D3o9aOh6.js`) que el `dist` del repo.
- 14 capturas por CDP con Chrome headless (puerto 18102), hosts externos bloqueados por `--host-resolver-rules` y por `Fetch` (0 peticiones externas registradas). Hash distinto en las 14 y miré cada PNG.
- **P-001 observado:** compilado con `VITE_BASE=/coipo_notebooklm/` (como hace `deploy.yml`) y servido bajo ese subdirectorio, las 15 miniaturas de la galería dan 404 (`_generador/registro_capturas.json`, captura `14_pages_galeria_rota`).
- Botón «Copiar» en Chrome headless: se vio «Selecciona y copia» (la degradación funciona).
- PDF con Word 2007 por COM (PrintOut a «Microsoft Print to PDF», un Word nuevo por documento): índice calculado (0 «Actualizar campo»), 0 palabras con dos tildes, 0 capturas faltantes. Rasterice y mire: matriz de permisos, hallazgos, una ficha de QA y dos páginas del manual con captura.
- `validar.py` se vio en rojo con una captura sin pie agregada a propósito (rc=1) y en verde sin ella.

## Defectos de la aplicación
| Id | Gravedad | Certeza | Evidencia |
|---|---|---|---|
| P-001 Galería rota en GitHub Pages | alta | observado en local; el sitio real no lo comprobé | scripts/optimizar_galeria.py:134-135,152-153,167; frontend/src/content/GaleriaInfografias.jsx:57 |
| P-003 Textos que no calzan con los datos y temas duplicados | media | verificado en el código y en la captura | frontend/src/content/GaleriaVideos.jsx:17; GaleriaAudios.jsx:19 |
| P-002 Piezas extra muestran solo «—» | baja | observado | scripts/gen_galeria.py:238; components/Lightbox.jsx:32-33 |
| P-004 Docstring cita `--esperar`, que no existe | baja | verificado en el código; no lo ejecuté | scripts/gen_galeria.py:12 frente a 368-376 |
| P-005 Visor re-enfoca «Cerrar» al cambiar de pieza | baja | verificado en el código | components/Lightbox.jsx:7-22 |

## Lo que no comprobé
- El sitio publicado en GitHub Pages (no se visitó; sin producción).
- Reproducción de vídeos y audios, descarga desde el visor, copia real al portapapeles, persistencia del sistema elegido al recargar, cierre del menú móvil, enlaces a apartados.
- Los scripts de Python que usan NotebookLM (requieren Google real; prohibido). Ejecutar `gen_galeria.py --esperar` para P-004 fue denegado por el entorno.

## Defectos en mi propio trabajo
- Primer intento de capturas: los servidores no arrancaron (el `python` de PowerShell era el alias de WindowsApps) y las 12 primeras capturas eran la misma página de error; lo detecté por hash repetido y lo rehice con la ruta completa de Python.
- La primera copia con robocopy dejó `node_modules` incompleto; se rehízo con Copy-Item.

## Archivos
Solo `docs/Documentacion_Sistema2/` (nuevo). No se tocó código de la app, no se hizo npm install en el repo, ni commit ni push.
