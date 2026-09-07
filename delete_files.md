# Archivos propuestos para borrar

> Generado por `Sud-Austral/coipo_aireadme`. **Nada se borro.**
> Esta es una lista para revisar; la decision es de una persona.


## Cuanto se recupera

El detector encontro **6** candidatos (275 KB), el **2.0%** de los 306 archivos que el analizador recorre en cada corrida.

De ellos, **0** se proponen para borrar (0 KB) y **6** quedan para revisar.

Esto no es solo orden: cada archivo muerto ocupa presupuesto de contexto y empuja la evidencia real contra el corte de 30.000 caracteres que se envia al modelo.

## Revisar antes de decidir

| Archivo | Tamaño | Por que |
| --- | ---: | --- |
| `readme_context/README_EVIDENCE.json` | 171 KB | El revisor no se pronuncio sobre este archivo. El detector lo marco como artefacto del generador. |
| `readme_context/repository_analysis.json` | 80 KB | El revisor no se pronuncio sobre este archivo. El detector lo marco como artefacto del generador. |
| `readme_context/README_CONTEXT_ULTRA.md` | 12 KB | El revisor no se pronuncio sobre este archivo. El detector lo marco como artefacto del generador. |
| `README_CANDIDATE.md` | 8 KB | El revisor no se pronuncio sobre este archivo. El detector lo marco como artefacto del generador. |
| `video/pipeline/guion_ecosistema2.py` | 3 KB | El revisor no se pronuncio sobre este archivo. El detector lo marco como huerfano aparente. |
| `frontend/src/lib/dedent.js` | 1 KB | El revisor no se pronuncio sobre este archivo. El detector lo marco como huerfano aparente. |


## Lo que este analisis no puede ver

La deteccion de huerfanos es estatica. No ve `importlib`, ni imports
dinamicos, ni rutas construidas en cadenas de texto, ni archivos
referenciados desde HTML, ni datos que se leen por ruta en tiempo de
ejecucion.

Por eso hay una seccion **Revisar**: no es una nota al pie, es la mitad del
informe.
