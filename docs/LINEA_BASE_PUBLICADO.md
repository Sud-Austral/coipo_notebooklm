# Línea base de lo publicado — coipo_notebooklm

> Generado el 2026-10-26 con la metodología «Mejorar una app ya publicada» (objetivo 527, versión con banda de ruido
> y hallazgos preexistentes). Solo lectura sobre lo publicado (GET). **Archivo nuevo, sin commit.**

## 1. Identificación
| | |
|---|---|
| Repositorio | coipo_notebooklm |
| Rama local / commit local | videos-v2 / d4f96db |
| Árbol de trabajo | 3 archivos sin commitear (`frontend/package-lock.json` y `video/package-lock.json` modificados; `HUSKY_AUDIT.md` nuevo; no se tocaron) |
| Sembrada (`.semilla`) | no (no existe `.semilla`) |
| Qué es | Puente entre NotebookLM y el repositorio para generar artefactos multimedia (README.md:3-5) |

## 2. Entorno y evidencia del dominio
| Entorno | Dominio | Evidencia (archivo:línea) |
|---|---|---|
| ninguno (GitHub Pages) | sin dominio detectable | .github/workflows: «Publicar en GitHub Pages»; la URL de Pages no figura en README ni workflow |

## 3. CI y despliegue (gh run list)
`Publicar en GitHub Pages` (main) success en 008dafc, 40a8cea, 02d62bf; `Run README Maintainer` success. La rama local `videos-v2` no es la que despliega.
Commit publicado (/health): sin /health · coincide con la rama: no aplica

## 4. Funcionalidad medida (2 pasadas × 5 repeticiones, solo GET)
No se midió: no hay dominio declarado en el repo (no se adivinó la URL de github.io).

Hallazgos de la medición:
- Sin dominio, la línea base no cubre este repo.

## 5. Hallazgos preexistentes (lo raro que ya existía) y si es por diseño
| Hallazgo | ¿Por diseño? | Fuente |
|---|---|---|
| Rama local `videos-v2` distinta de `main` (la que publica) | no lo comprobé | gh run list: todos en `main` |

## 6. Interfaz
No medida en esta pasada.

## 7. Defectos simples corregidos (sin commit)
| Archivo | Antes | Después | Cómo se verificó |
|---|---|---|---|
| — | — | — | Ninguno aplicado: se buscaron enlaces relativos rotos en todos los `.md` (script propio, sin hallazgos) y se compararon puertos/dominios del README con compose y workflows (coinciden). |

Defectos vistos y NO corregidos (con motivo): Ninguno.

## 8. No lo comprobé
- Sitio publicado en Pages: URL no declarada.
