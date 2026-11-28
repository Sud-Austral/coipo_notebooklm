# Problemas abiertos: coipo_notebooklm

Actualizado el 2026-11-15. Gravedad: crítica: expone secretos o datos personales; alta: una parte del sitio publicado no funciona; media: información incorrecta o confusa para el usuario; baja: detalle de forma o de mantenimiento.

| Id | Título | Gravedad | Módulo | Evidencia | Certeza | Estado |
|---|---|---|---|---|---|---|
| P-001 | La galería no carga en GitHub Pages (rutas de medios absolutas) | alta | Galería (Usuario) | scripts/optimizar_galeria.py:134-135, 152-153, 167; content/GaleriaInfografias.jsx:57; captura 14_pages_galeria_rota | observado (compilado local con VITE_BASE=/coipo_notebooklm/: 15 de 15 miniaturas con 404); el sitio real no lo comprobé | abierto |
| P-002 | Piezas «extra» sin estilo ni orientación: la tarjeta y el visor muestran solo un guion | baja | Galería (Usuario) | scripts/gen_galeria.py:238 («estilo»: «—»); content/GaleriaInfografias.jsx:68; components/Lightbox.jsx:32-33; captura 04_visor_infografia | observado (captura 04_visor_infografia) | abierto |
| P-003 | Textos de la galería que no calzan con los datos (temas duplicados, «estilo distinto», «uno por formato») | media | Galería (Usuario) | content/GaleriaVideos.jsx:17; content/GaleriaAudios.jsx:19; data/galeria.js (video-02 y video-09 son «classic»; audio-00 y audio-04 son «brief»; tema «Bosque Templado Valdiviano» de extra-video-00); captura 05_videos | verificado en el código y observado en la captura 05_videos | abierto |
| P-004 | La ayuda de gen_galeria.py menciona --esperar, que no existe | baja | Scripts de galería (operador) | scripts/gen_galeria.py:12 (docstring con --esperar) frente a scripts/gen_galeria.py:368-376 (opciones reales: --plan, --lanzar, --ciclo, --adoptar, --manifiesto, --limite, --max-min) | verificado en el código; no lo ejecuté | abierto |
| P-005 | El visor de infografías re-registra el teclado y re-enfoca «Cerrar» en cada cambio de pieza | baja | Galería (Usuario) | content/GaleriaInfografias.jsx:76-81 (funciones nuevas en cada render); components/Lightbox.jsx:7-22 (efecto que depende de ellas y llama a focus) | verificado en el código; el efecto en lectores de pantalla no lo comprobé | abierto |

## Cerrados

Ninguno (primera versión).
