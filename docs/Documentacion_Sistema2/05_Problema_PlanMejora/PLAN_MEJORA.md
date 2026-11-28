# Plan de mejora: coipo_notebooklm

Actualizado el 2026-11-15. Propone; no modifica código. Esfuerzos: estimaciones.

## P-001 La galería no carga en GitHub Pages (rutas de medios absolutas) (alta)

- **Causa raíz:** optimizar_galeria.py escribe src, thumb y poster como «/galeria/...», absolutos a la raíz del dominio. El workflow compila con VITE_BASE=/<repo>/ (deploy.yml, paso Compilar), y Vite solo reescribe los assets que importa; las cadenas del manifiesto llegan tal cual. En un Pages de proyecto la raíz del dominio no es el sitio.
- **Solución propuesta:** Escribir rutas relativas en el manifiesto («galeria/...», sin barra inicial) o anteponer import.meta.env.BASE_URL al usar item.src, item.thumb e item.poster. Alternativa descartada: publicar en la raíz de un dominio propio (cambia la infraestructura y no arregla el defecto).
- **Pasos:** 1) En scripts/optimizar_galeria.py:134-167 quitar la barra inicial, o 2) crear en frontend/src/lib/ una función medio(ruta) que devuelva import.meta.env.BASE_URL + ruta sin barra y usarla en GaleriaInfografias.jsx:57, Lightbox.jsx:36 y 49, GaleriaVideos.jsx:46-47 y GaleriaAudios.jsx:45. Sin cambios de esquema.
- **Prueba que lo demuestra (debe verse en rojo antes):** Repetir _generador/capturar.py contra el compilado con VITE_BASE=/coipo_notebooklm/: hoy registra pages_imgs_rotas=15 (rojo); tras el arreglo debe dar 0. Se puede convertir en un script de npm que compile con VITE_BASE y compruebe que cada src del manifiesto existe bajo dist/.
- **Criterio de aceptación:** En el compilado con VITE_BASE=/coipo_notebooklm/ cargan las 15 miniaturas, los 11 carteles y los 6 audios; en el sitio publicado lo mismo.
- **Riesgos:** Ninguno sobre datos. Requiere volver a correr optimizar_galeria.py o editar el generado, que no se edita a mano.
- **Dependencias y quién decide:** ¿El sitio publicado hoy en Pages muestra la galería? Lo debe mirar quien tiene la URL (no lo comprobé).
- **Esfuerzo:** 1 a 2 horas (estimación)

## P-003 Textos de la galería que no calzan con los datos (temas duplicados, «estilo distinto», «uno por formato») (media)

- **Causa raíz:** Los textos fijos de las secciones se escribieron para el plan inicial; después se adoptaron piezas extra y se repitieron estilos y formatos.
- **Solución propuesta:** Ajustar los textos («con estilos visuales variados») o derivarlos de los datos; normalizar el tema de extra-video-00 al de video-03 si es el mismo contenido.
- **Pasos:** Editar GaleriaVideos.jsx:16-17 y GaleriaAudios.jsx:18-20; corregir el tema en el estado de gen_galeria.py y regenerar el manifiesto.
- **Prueba que lo demuestra (debe verse en rojo antes):** Script que cuente estilos distintos frente a piezas y falle si el texto afirma uno por pieza; hoy falla (rojo).
- **Criterio de aceptación:** Los textos coinciden con galeria.js y el filtro no muestra dos temas para el mismo bosque.
- **Riesgos:** Ninguno.
- **Dependencias y quién decide:** ¿Es el mismo tema «Bosque Templado Valdiviano» y «Bosque valdiviano templado lluvioso»? Lo decide el autor del contenido.
- **Esfuerzo:** 1 hora (estimación)

## P-002 Piezas «extra» sin estilo ni orientación: la tarjeta y el visor muestran solo un guion (baja)

- **Causa raíz:** Las piezas adoptadas (--adoptar) se guardan con estilo «—» y orientación nula, y los componentes imprimen los campos sin comprobarlos.
- **Solución propuesta:** No mostrar la línea de estilo cuando el valor es «—» o nulo, o guardar el estilo real al adoptar si se conoce.
- **Pasos:** Condicionar el texto en GaleriaInfografias.jsx:67-69, Lightbox.jsx:31-34 y GaleriaVideos.jsx:51-53.
- **Prueba que lo demuestra (debe verse en rojo antes):** Captura del visor sobre extra-infographic-00 antes (se ve «—») y después (no se ve).
- **Criterio de aceptación:** Ninguna tarjeta ni visor muestra un guion suelto o «· » al final.
- **Riesgos:** Ninguno.
- **Dependencias y quién decide:** Nadie: es de forma.
- **Esfuerzo:** 30 minutos (estimación)

## P-004 La ayuda de gen_galeria.py menciona --esperar, que no existe (baja)

- **Causa raíz:** El docstring no se actualizó al reemplazar --esperar por --ciclo.
- **Solución propuesta:** Actualizar el docstring a las opciones reales.
- **Pasos:** Editar scripts/gen_galeria.py:10-12.
- **Prueba que lo demuestra (debe verse en rojo antes):** python scripts/gen_galeria.py --help debe listar cada opción que cite el docstring (comprobación por script).
- **Criterio de aceptación:** El docstring solo nombra opciones existentes.
- **Riesgos:** Ninguno.
- **Dependencias y quién decide:** Nadie.
- **Esfuerzo:** 15 minutos (estimación)

## P-005 El visor de infografías re-registra el teclado y re-enfoca «Cerrar» en cada cambio de pieza (baja)

- **Causa raíz:** onClose, onPrev y onNext son funciones nuevas en cada render, así que el efecto se desmonta y se vuelve a montar al cambiar de pieza.
- **Solución propuesta:** Envolver las funciones con useCallback en GaleriaInfografias.jsx, o separar el enfoque inicial en un efecto sin dependencias.
- **Pasos:** Editar GaleriaInfografias.jsx:17-18 y 76-81; o Lightbox.jsx:7-22.
- **Prueba que lo demuestra (debe verse en rojo antes):** Contar llamadas a focus por CDP al pulsar la flecha: por lectura del código se espera 1 por pulsación hoy (no lo medí), y 0 después del arreglo.
- **Criterio de aceptación:** Al pasar de pieza el foco no salta a «Cerrar».
- **Riesgos:** Ninguno.
- **Dependencias y quién decide:** Nadie.
- **Esfuerzo:** 30 minutos (estimación)

## Hoja de ruta

| Problema | Fase | Esfuerzo | Responsable |
|---|---|---|---|
| P-001 | Inmediato | 1 a 2 horas (estimación) | [POR VALIDAR] mantenedor del repositorio |
| P-002 | Corto plazo | 30 minutos (estimación) | [POR VALIDAR] mantenedor del repositorio |
| P-003 | Corto plazo | 1 hora (estimación) | [POR VALIDAR] mantenedor del repositorio |
| P-004 | Corto plazo | 15 minutos (estimación) | [POR VALIDAR] mantenedor del repositorio |
| P-005 | Mediano plazo | 30 minutos (estimación) | [POR VALIDAR] mantenedor del repositorio |
