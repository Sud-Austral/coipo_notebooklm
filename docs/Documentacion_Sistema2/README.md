# Documentacion_Sistema2: Guía de conexión NotebookLM (coipo_notebooklm)

Versión 2, generada el 2026-11-15. Primera versión: no había paquete anterior en el repositorio.

## Qué leer primero
1. `01_Manuales/Manual_Usuario.docx`: cómo usar el sitio.
2. `05_Problema_PlanMejora/PROBLEMAS.md`: lo que está roto, empezando por P-001.
3. `00_Analisis/Analisis_Sistema.docx`: roles, reglas, hallazgos y cobertura.

## Cifras (calculadas por `_generador/generar.py`)

| Concepto | Valor |
|---|---|
| Roles con pantalla | 1 (Usuario) |
| Secciones del sitio | 15 |
| Funcionalidades | 11 |
| Casos de uso | 12 |
| Fichas de QA | 12 + 4 negativas |
| Reglas | 10 |
| Problemas abiertos | 5 |
| Capturas | 14 |
| Cobertura | 11 de 11 funcionalidades con caso |
| Guion de vídeo | 156 palabras |
| Páginas de `_pdf/Analisis_Sistema.pdf` | 5 |
| Páginas de `_pdf/Casos_de_Uso_Usuario.pdf` | 6 |
| Páginas de `_pdf/Checklist_QA.pdf` | 6 |
| Páginas de `_pdf/Manual_Usuario.pdf` | 14 |

## Estructura

- `00_Analisis/`: análisis e `INFORME_EJECUCION_<fecha>.md`.
- `01_Manuales/`: manual del rol Usuario, guion de vídeo y lista de capturas.
- `02_Casos_de_Uso/`, `03_QA/`, `04_Trazabilidad/` (planilla con panel inmovilizado y autofiltro).
- `05_Problema_PlanMejora/`: `PROBLEMAS.md` y `PLAN_MEJORA.md`.
- `_imagenes/`: capturas PNG de 1000 px a 144 ppp. `_pdf/`: PDF con índice calculado.
- `_generador/`: todo lo necesario para regenerar.

## Cómo se regenera

Desde la raíz del repositorio, en PowerShell:

```
# 1. Capturas (opcional): servir frontend/dist en 127.0.0.1:18100, un compilado con
#    VITE_BASE=/coipo_notebooklm/ en 127.0.0.1:18101/coipo_notebooklm/, y Chrome headless
#    con --remote-debugging-port=18102 --host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"
python docs/Documentacion_Sistema2/_generador/capturar.py docs/Documentacion_Sistema2/_imagenes
python docs/Documentacion_Sistema2/_generador/generar.py
python docs/Documentacion_Sistema2/_generador/exportar_pdf.py   # Word por COM, un proceso por documento
python docs/Documentacion_Sistema2/_generador/generar.py        # de nuevo: escribe las páginas en este README
python docs/Documentacion_Sistema2/_generador/validar.py
```

No se usa producción, ni Google real, ni la red: las capturas se hacen en local con los hosts externos bloqueados.
