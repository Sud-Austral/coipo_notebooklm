# -*- coding: utf-8 -*-
"""Problemas (id estable P-NNN) y plan de mejora. Escribe PROBLEMAS.md y PLAN_MEJORA.md."""

CRITERIO = ("crítica: expone secretos o datos personales; alta: una parte del sitio publicado no funciona; "
            "media: información incorrecta o confusa para el usuario; baja: detalle de forma o de mantenimiento.")

PROBLEMAS = [
    {"id": "P-001", "titulo": "La galería no carga en GitHub Pages (rutas de medios absolutas)", "gravedad": "alta",
     "modulo": "Galería (Usuario)",
     "evidencia": "scripts/optimizar_galeria.py:134-135, 152-153, 167; content/GaleriaInfografias.jsx:57; captura 14_pages_galeria_rota",
     "certeza": "observado (compilado local con VITE_BASE=/coipo_notebooklm/: 15 de 15 miniaturas con 404); el sitio real no lo comprobé",
     "estado": "abierto",
     "causa": "optimizar_galeria.py escribe src, thumb y poster como «/galeria/...», absolutos a la raíz del dominio. El workflow compila con VITE_BASE=/<repo>/ (deploy.yml, paso Compilar), y Vite solo reescribe los assets que importa; las cadenas del manifiesto llegan tal cual. En un Pages de proyecto la raíz del dominio no es el sitio.",
     "solucion": "Escribir rutas relativas en el manifiesto («galeria/...», sin barra inicial) o anteponer import.meta.env.BASE_URL al usar item.src, item.thumb e item.poster. Alternativa descartada: publicar en la raíz de un dominio propio (cambia la infraestructura y no arregla el defecto).",
     "pasos": "1) En scripts/optimizar_galeria.py:134-167 quitar la barra inicial, o 2) crear en frontend/src/lib/ una función medio(ruta) que devuelva import.meta.env.BASE_URL + ruta sin barra y usarla en GaleriaInfografias.jsx:57, Lightbox.jsx:36 y 49, GaleriaVideos.jsx:46-47 y GaleriaAudios.jsx:45. Sin cambios de esquema.",
     "prueba": "Repetir _generador/capturar.py contra el compilado con VITE_BASE=/coipo_notebooklm/: hoy registra pages_imgs_rotas=15 (rojo); tras el arreglo debe dar 0. Se puede convertir en un script de npm que compile con VITE_BASE y compruebe que cada src del manifiesto existe bajo dist/.",
     "aceptacion": "En el compilado con VITE_BASE=/coipo_notebooklm/ cargan las 15 miniaturas, los 11 carteles y los 6 audios; en el sitio publicado lo mismo.",
     "riesgos": "Ninguno sobre datos. Requiere volver a correr optimizar_galeria.py o editar el generado, que no se edita a mano.",
     "decide": "¿El sitio publicado hoy en Pages muestra la galería? Lo debe mirar quien tiene la URL (no lo comprobé).",
     "esfuerzo": "1 a 2 horas (estimación)", "fase": "Inmediato"},
    {"id": "P-002", "titulo": "Piezas «extra» sin estilo ni orientación: la tarjeta y el visor muestran solo un guion", "gravedad": "baja",
     "modulo": "Galería (Usuario)",
     "evidencia": "scripts/gen_galeria.py:238 («estilo»: «—»); content/GaleriaInfografias.jsx:68; components/Lightbox.jsx:32-33; captura 04_visor_infografia",
     "certeza": "observado (captura 04_visor_infografia)", "estado": "abierto",
     "causa": "Las piezas adoptadas (--adoptar) se guardan con estilo «—» y orientación nula, y los componentes imprimen los campos sin comprobarlos.",
     "solucion": "No mostrar la línea de estilo cuando el valor es «—» o nulo, o guardar el estilo real al adoptar si se conoce.",
     "pasos": "Condicionar el texto en GaleriaInfografias.jsx:67-69, Lightbox.jsx:31-34 y GaleriaVideos.jsx:51-53.",
     "prueba": "Captura del visor sobre extra-infographic-00 antes (se ve «—») y después (no se ve).",
     "aceptacion": "Ninguna tarjeta ni visor muestra un guion suelto o «· » al final.",
     "riesgos": "Ninguno.", "decide": "Nadie: es de forma.", "esfuerzo": "30 minutos (estimación)", "fase": "Corto plazo"},
    {"id": "P-003", "titulo": "Textos de la galería que no calzan con los datos (temas duplicados, «estilo distinto», «uno por formato»)", "gravedad": "media",
     "modulo": "Galería (Usuario)",
     "evidencia": "content/GaleriaVideos.jsx:17; content/GaleriaAudios.jsx:19; data/galeria.js (video-02 y video-09 son «classic»; audio-00 y audio-04 son «brief»; tema «Bosque Templado Valdiviano» de extra-video-00); captura 05_videos",
     "certeza": "verificado en el código y observado en la captura 05_videos", "estado": "abierto",
     "causa": "Los textos fijos de las secciones se escribieron para el plan inicial; después se adoptaron piezas extra y se repitieron estilos y formatos.",
     "solucion": "Ajustar los textos («con estilos visuales variados») o derivarlos de los datos; normalizar el tema de extra-video-00 al de video-03 si es el mismo contenido.",
     "pasos": "Editar GaleriaVideos.jsx:16-17 y GaleriaAudios.jsx:18-20; corregir el tema en el estado de gen_galeria.py y regenerar el manifiesto.",
     "prueba": "Script que cuente estilos distintos frente a piezas y falle si el texto afirma uno por pieza; hoy falla (rojo).",
     "aceptacion": "Los textos coinciden con galeria.js y el filtro no muestra dos temas para el mismo bosque.",
     "riesgos": "Ninguno.", "decide": "¿Es el mismo tema «Bosque Templado Valdiviano» y «Bosque valdiviano templado lluvioso»? Lo decide el autor del contenido.",
     "esfuerzo": "1 hora (estimación)", "fase": "Corto plazo"},
    {"id": "P-004", "titulo": "La ayuda de gen_galeria.py menciona --esperar, que no existe", "gravedad": "baja",
     "modulo": "Scripts de galería (operador)",
     "evidencia": "scripts/gen_galeria.py:12 (docstring con --esperar) frente a scripts/gen_galeria.py:368-376 (opciones reales: --plan, --lanzar, --ciclo, --adoptar, --manifiesto, --limite, --max-min)",
     "certeza": "verificado en el código; no lo ejecuté", "estado": "abierto",
     "causa": "El docstring no se actualizó al reemplazar --esperar por --ciclo.",
     "solucion": "Actualizar el docstring a las opciones reales.", "pasos": "Editar scripts/gen_galeria.py:10-12.",
     "prueba": "python scripts/gen_galeria.py --help debe listar cada opción que cite el docstring (comprobación por script).",
     "aceptacion": "El docstring solo nombra opciones existentes.", "riesgos": "Ninguno.", "decide": "Nadie.",
     "esfuerzo": "15 minutos (estimación)", "fase": "Corto plazo"},
    {"id": "P-005", "titulo": "El visor de infografías re-registra el teclado y re-enfoca «Cerrar» en cada cambio de pieza", "gravedad": "baja",
     "modulo": "Galería (Usuario)",
     "evidencia": "content/GaleriaInfografias.jsx:76-81 (funciones nuevas en cada render); components/Lightbox.jsx:7-22 (efecto que depende de ellas y llama a focus)",
     "certeza": "verificado en el código; el efecto en lectores de pantalla no lo comprobé", "estado": "abierto",
     "causa": "onClose, onPrev y onNext son funciones nuevas en cada render, así que el efecto se desmonta y se vuelve a montar al cambiar de pieza.",
     "solucion": "Envolver las funciones con useCallback en GaleriaInfografias.jsx, o separar el enfoque inicial en un efecto sin dependencias.",
     "pasos": "Editar GaleriaInfografias.jsx:17-18 y 76-81; o Lightbox.jsx:7-22.",
     "prueba": "Contar llamadas a focus por CDP al pulsar la flecha: por lectura del código se espera 1 por pulsación hoy (no lo medí), y 0 después del arreglo.",
     "aceptacion": "Al pasar de pieza el foco no salta a «Cerrar».", "riesgos": "Ninguno.", "decide": "Nadie.",
     "esfuerzo": "30 minutos (estimación)", "fase": "Mediano plazo"},
]


def escribir(carpeta, hoy):
    carpeta.mkdir(parents=True, exist_ok=True)
    L = ["# Problemas abiertos: coipo_notebooklm", "", f"Actualizado el {hoy}. Gravedad: {CRITERIO}", "",
         "| Id | Título | Gravedad | Módulo | Evidencia | Certeza | Estado |", "|---|---|---|---|---|---|---|"]
    for p in PROBLEMAS:
        L.append(f"| {p['id']} | {p['titulo']} | {p['gravedad']} | {p['modulo']} | {p['evidencia']} | {p['certeza']} | {p['estado']} |")
    L += ["", "## Cerrados", "", "Ninguno (primera versión).", ""]
    (carpeta / "PROBLEMAS.md").write_text("\n".join(L), encoding="utf-8")

    orden = {"crítica": 0, "alta": 1, "media": 2, "baja": 3}
    M = ["# Plan de mejora: coipo_notebooklm", "", f"Actualizado el {hoy}. Propone; no modifica código. Esfuerzos: estimaciones.", ""]
    for p in sorted(PROBLEMAS, key=lambda x: orden[x["gravedad"]]):
        if p["estado"] != "abierto":
            continue
        M += [f"## {p['id']} {p['titulo']} ({p['gravedad']})", "",
              f"- **Causa raíz:** {p['causa']}", f"- **Solución propuesta:** {p['solucion']}",
              f"- **Pasos:** {p['pasos']}", f"- **Prueba que lo demuestra (debe verse en rojo antes):** {p['prueba']}",
              f"- **Criterio de aceptación:** {p['aceptacion']}", f"- **Riesgos:** {p['riesgos']}",
              f"- **Dependencias y quién decide:** {p['decide']}", f"- **Esfuerzo:** {p['esfuerzo']}", ""]
    M += ["## Hoja de ruta", "", "| Problema | Fase | Esfuerzo | Responsable |", "|---|---|---|---|"]
    for p in PROBLEMAS:
        M.append(f"| {p['id']} | {p['fase']} | {p['esfuerzo']} | [POR VALIDAR] mantenedor del repositorio |")
    M.append("")
    (carpeta / "PLAN_MEJORA.md").write_text("\n".join(M), encoding="utf-8")
