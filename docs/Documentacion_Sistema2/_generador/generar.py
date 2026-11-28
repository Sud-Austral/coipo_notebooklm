# -*- coding: utf-8 -*-
"""Genera los DOCX, el XLSX y los textos del paquete Documentacion_Sistema2.

    python docs/Documentacion_Sistema2/_generador/generar.py

Lee datos.py, problemas.py y las capturas de _imagenes/. Si existen PDF en _pdf/,
escribe sus páginas en el README. Fecha: la de `date` del momento de generar.
"""
import datetime, os, re, sys, unicodedata
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

sys.path.insert(0, os.path.dirname(__file__))
import datos as D  # noqa: E402
import problemas as P  # noqa: E402

RAIZ_DOC = Path(__file__).resolve().parent.parent  # docs/Documentacion_Sistema2
IMG = RAIZ_DOC / "_imagenes"
HOY = datetime.date.today().isoformat()
AZUL = RGBColor(0x1F, 0x3A, 0x5F)

PIES = {
    "01_inicio": "Portada «Qué es esto» con menú lateral, selector de sistema y columna «En esta página».",
    "02_infografias": "Galería de infografías: aviso de material generado por IA y fila de temas.",
    "03_infografias_filtro": "Infografías filtradas por el tema «Tesoros Vivos: Árboles de Chile».",
    "04_visor_infografia": "Visor a pantalla completa con «Descargar» y «Cerrar».",
    "05_videos": "Galería de vídeos con filtro de temas y carteles.",
    "06_audios": "Galería de audios con el formato de cada uno.",
    "07_instalacion_windows": "Instalación con ejemplos de PowerShell (Windows).",
    "08_instalacion_unix": "Instalación con ejemplos de bash / zsh tras elegir macOS / Linux.",
    "09_copiar": "Botón de copiar sin permiso de portapapeles: «Selecciona y copia».",
    "10_troubleshooting": "Sección «Troubleshooting» con la tabla de síntomas.",
    "11_seccion_inexistente": "Aviso «Esa sección no existe» para #/no-existe.",
    "12_tema_oscuro": "Portada en tema oscuro (esquema del sistema).",
    "13_movil_menu": "Teléfono de 390 px con el menú de secciones abierto.",
    "14_pages_galeria_rota": "Compilado con VITE_BASE=/coipo_notebooklm/ (como GitHub Pages): las 15 miniaturas no cargan (P-001).",
}


def sin_tildes(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn").lower()


# ---------- utilidades DOCX ----------
def doc_nuevo(titulo, subtitulo):
    d = Document()
    st = d.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(10.5)
    for s in d.sections:
        s.left_margin = s.right_margin = Cm(2.2); s.top_margin = s.bottom_margin = Cm(2)
    p = d.add_paragraph(); r = p.add_run(titulo); r.bold = True; r.font.size = Pt(24); r.font.color.rgb = AZUL
    d.add_paragraph(subtitulo)
    d.add_paragraph(f"Sistema: {D.SISTEMA}. Versión {D.VERSION} del paquete. Generado el {HOY}.")
    d.add_paragraph("Índice").runs[0].bold = True
    toc(d)
    d.add_page_break()
    return d


def toc(d):
    p = d.add_paragraph(); r = p.add_run()
    for tipo, txt in (("begin", None), (None, 'TOC \\o "1-2" \\h \\z \\u'), ("separate", None), (None, "Actualizar campo (F9)"), ("end", None)):
        if tipo:
            e = OxmlElement("w:fldChar"); e.set(qn("w:fldCharType"), tipo); r._r.append(e)
        elif txt.startswith("TOC"):
            e = OxmlElement("w:instrText"); e.set(qn("xml:space"), "preserve"); e.text = txt; r._r.append(e)
        else:
            e = OxmlElement("w:t"); e.text = txt; r._r.append(e)


def tabla(d, cab, filas, anchos=None):
    t = d.add_table(rows=1, cols=len(cab)); t.style = "Table Grid"
    for i, c in enumerate(cab):
        cel = t.rows[0].cells[i]; cel.text = ""; run = cel.paragraphs[0].add_run(str(c)); run.bold = True
        sh = OxmlElement("w:shd"); sh.set(qn("w:val"), "clear"); sh.set(qn("w:fill"), "DCE6F0"); cel._tc.get_or_add_tcPr().append(sh)
    for f in filas:
        cells = t.add_row().cells
        for i, v in enumerate(f):
            cells[i].text = str(v)
    for row in t.rows:
        for c in row.cells:
            for p in c.paragraphs:
                for r in p.runs:
                    r.font.size = Pt(9)
    if anchos:
        for row in t.rows:
            for i, w in enumerate(anchos):
                row.cells[i].width = Cm(w)
    d.add_paragraph()
    return t


def imagen(d, nombre, ancho=15.5):
    ruta = IMG / f"{nombre}.png"
    if not ruta.exists():
        d.add_paragraph(f"[CAPTURA FALTANTE: {nombre}]")
        return
    if nombre == "13_movil_menu":
        ancho = 6.5
    d.add_picture(str(ruta), width=Cm(ancho))
    d.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    p = d.add_paragraph(f"Figura: {PIES[nombre]} ({nombre}.png)"); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.runs[0].italic = True; p.runs[0].font.size = Pt(9)


def lista_numerada(d, pasos):
    # Numeración escrita como texto: cada ficha reinicia en 1 sin depender de w:num.
    for i, s in enumerate(pasos, 1):
        d.add_paragraph(f"{i}. {s}")


def viñetas(d, items):
    for s in items:
        d.add_paragraph(s, style="List Bullet")


# ---------- análisis ----------
def analisis():
    d = doc_nuevo("Análisis del sistema", "Roles, permisos, reglas, hallazgos y cobertura calculada.")
    d.add_heading("1. Qué cambió desde la versión anterior", 1)
    tabla(d, ["Fecha", "Cambio", "Dónde está el detalle"],
          [[HOY, "Primera versión generada: no existía paquete Documentacion_Sistema en el repositorio.", "README.md del paquete"]])
    d.add_heading("2. Qué es el sistema", 1)
    d.add_paragraph("Sitio estático en React 19 + Vite 8 (frontend/) que explica cómo conectar un proyecto con NotebookLM "
                    "mediante el cliente no oficial notebooklm-mcp-cli 0.9.10 y muestra una galería de infografías, vídeos y "
                    "audios generados con NotebookLM. La galería la alimentan scripts de Python (scripts/gen_galeria.py y "
                    "scripts/optimizar_galeria.py) que el autor ejecuta en su equipo; el sitio solo lee el manifiesto generado "
                    "frontend/src/data/galeria.js. El repositorio también contiene video/ (Remotion), que no forma parte del sitio "
                    "y no se documenta aquí.")
    tabla(d, ["Pieza", "Qué hace", "Evidencia"], [
        ["Sitio React", "15 secciones en 6 grupos, rutas por hash", "frontend/src/content/sections.js:23-43"],
        ["Galería", conteo_galeria(), "frontend/src/data/galeria.js"],
        ["Scripts Python", "Generan, descargan y optimizan la galería con una sesión real de Google", "scripts/gen_galeria.py, scripts/optimizar_galeria.py"],
        ["Publicación", "GitHub Pages con VITE_BASE=/<repo>/ y gate check:publish", ".github/workflows/deploy.yml"],
    ])
    d.add_heading("3. Roles", 1)
    d.add_paragraph("No hay autenticación, servidor de aplicación ni capa de autorización: el sitio es estático. "
                    "Por eso hay un solo rol con pantalla, «Usuario», y no hay permisos que el servidor pueda negar.")
    tabla(d, ["Rol", "Cómo entra", "Qué ve"], [[D.ROL["nombre"], "Abre la dirección del sitio, sin sesión", "Las 15 secciones y la galería"]])
    d.add_heading("Roles que NO se documentan", 2)
    tabla(d, ["Rol", "Motivo"], D.ROLES_NO_DOCUMENTADOS)
    d.add_heading("4. Matriz de permisos por acción", 1)
    tabla(d, ["Acción", "Usuario", "Quién lo controla"],
          [[f["nombre"], "Sí", "Nadie: sitio público estático"] for f in D.FUNCIONALIDADES])
    d.add_heading("5. Secciones del sitio", 1)
    tabla(d, ["Ruta", "Título", "Grupo"], [[f"#/{s}", t, g] for s, t, g in D.SECCIONES])
    d.add_heading("6. Estados", 1)
    tabla(d, ["Elemento", "Estados", "Evidencia"], [
        ["Botón Copiar", "idle («Copiar»), copied («Copiado»), error («Selecciona y copia»)", "components/CopyButton.jsx:3-7"],
        ["Sistema operativo", "windows, posix", "hooks/platformContext.js:5"],
        ["Menú móvil", "abierto, cerrado", "App.jsx:19"],
        ["Visor", "cerrado (-1) o índice de la pieza abierta", "content/GaleriaInfografias.jsx:13"],
    ])
    d.add_heading("7. Reglas", 1)
    tabla(d, ["Id", "Nombre", "Descripción", "Dónde vive"], D.REGLAS, [1.4, 3, 8, 4])
    d.add_heading("8. Hallazgos", 1)
    d.add_paragraph("Detalle, gravedad y plan en 05_Problema_PlanMejora. Certeza: «verificado en el código» = leí la línea; "
                    "«observado» = lo ejecuté y vi el resultado.")
    tabla(d, ["Id", "Título", "Gravedad", "Evidencia", "Certeza"],
          [[p["id"], p["titulo"], p["gravedad"], p["evidencia"], p["certeza"]] for p in P.PROBLEMAS if p["estado"] == "abierto"], [1.4, 5, 1.6, 5, 3])
    d.add_heading("Hallazgos al mirar las capturas", 2)
    tabla(d, ["Pantalla", "Qué se ve", "Captura", "Problema"], D.HALLAZGOS_PANTALLA)
    d.add_heading("9. Cobertura calculada", 1)
    filas = cobertura()
    tabla(d, ["Funcionalidad", "Casos", "Cubierta"], filas)
    cub = sum(1 for f in filas if f[2] == "Sí")
    d.add_paragraph(f"Cobertura: {cub} de {len(filas)} funcionalidades tienen al menos un caso de uso (cálculo por nombre, sin tildes).")
    d.add_heading("10. Lo que no se comprobó", 1)
    viñetas(d, ["El sitio publicado real en GitHub Pages: no se visitó (no se adivina su URL y no se usa producción).",
                "La reproducción de vídeos y audios, la descarga desde el visor y la copia efectiva al portapapeles.",
                "Los scripts de Python que hablan con NotebookLM: requieren una sesión real de Google.",
                "Lectores de pantalla y navegación solo con teclado más allá de lo descrito en el código."])
    guardar(d, "00_Analisis/Analisis_Sistema.docx")


def conteo_galeria():
    import json
    s = (RAIZ_DOC.parent.parent / "frontend/src/data/galeria.js").read_text(encoding="utf-8")
    g = json.loads(s[s.index("["):s.rindex("]") + 1])
    n = {t: sum(1 for a in g if a["tipo"] == t) for t in ("infographic", "video", "audio")}
    return f"{len(g)} piezas: {n['infographic']} infografías, {n['video']} vídeos, {n['audio']} audios"


def cobertura():
    filas = []
    for f in D.FUNCIONALIDADES:
        ids = [c["id"] for c in D.CASOS if sin_tildes(c["funcionalidad"]) == sin_tildes(f["nombre"])]
        filas.append([f["nombre"], ", ".join(ids) or "-", "Sí" if ids else "No"])
    return filas


# ---------- manual ----------
def manual():
    r = D.ROL
    d = doc_nuevo(f"Manual de usuario: {r['nombre']}", r["resumen"])
    d.add_heading("1. Novedades de la versión 2", 1)
    tabla(d, ["Qué cambió", "Qué significa para el Usuario"],
          [["Primera versión del manual (no había paquete anterior).", "Este documento describe el sitio tal como está en el código de hoy."]])
    d.add_heading("2. Acceso", 1)
    d.add_paragraph(r["acceso"])
    d.add_heading("3. Ingreso al sitio", 1)
    lista_numerada(d, D.FUNCIONALIDADES[0]["pasos"])
    imagen(d, "01_inicio")
    d.add_heading("4. La pantalla", 1)
    viñetas(d, ["Barra superior: nombre de la guía, etiqueta «Cliente no oficial» y selector Windows / macOS / Linux.",
                "Menú lateral: 15 secciones en los grupos Introducción, Galería, Puesta en marcha, Flujo de trabajo, Avanzado y Referencia.",
                "Centro: la sección, con «Anterior» y «Siguiente» al pie.",
                "Derecha (pantallas de más de 1180 px): «En esta página», con los apartados de la sección."])
    d.add_heading("5. Funcionalidades", 1)
    for f in D.FUNCIONALIDADES[1:]:
        d.add_heading(f["nombre"], 2)
        d.add_paragraph(f["objetivo"])
        lista_numerada(d, f["pasos"])
        d.add_paragraph(f"Resultado: {f['resultado']}")
        imagen(d, f["captura"]) if f["captura"] != "01_inicio" else None
        if f["nombre"] == "Elegir el sistema operativo de los ejemplos":
            imagen(d, "07_instalacion_windows")
        if f["nombre"] == "Filtrar la galería por tema":
            imagen(d, "02_infografias")
    d.add_heading("6. Mensajes que puede ver", 1)
    tabla(d, ["Mensaje", "Cuándo", "Qué hacer"], [
        ["Esa sección no existe", "La dirección tiene un identificador que no corresponde a ninguna sección", "Pulsar «Volver al principio de la guía»."],
        ["Selecciona y copia", "El navegador no permitió copiar", "Seleccionar el texto del bloque y copiarlo con el teclado."],
        ["Todavía no hay infografías descargadas...", "La galería está vacía", "Nada: lo resuelve quien publica el sitio."],
    ])
    imagen(d, "11_seccion_inexistente")
    d.add_heading("7. Preguntas frecuentes", 1)
    tabla(d, ["Pregunta", "Respuesta"], [
        ["¿Necesito cuenta?", "No para leer el sitio. Para seguir la guía y usar NotebookLM sí se necesita una cuenta de Google propia."],
        ["¿El material de la galería es oficial?", "No. Lo genera NotebookLM con IA; el propio sitio lo advierte."],
        ["¿Por qué los comandos no son los de mi sistema?", "Cambie el selector de la barra superior."],
        ["¿Hay modo oscuro?", "Sí, sigue la configuración del sistema; no hay botón propio."],
    ])
    imagen(d, "12_tema_oscuro")
    guardar(d, f"01_Manuales/Manual_{r['archivo']}.docx")


# ---------- casos de uso ----------
def casos():
    d = doc_nuevo(f"Casos de uso: {D.ROL['nombre']}", f"{len(D.CASOS)} casos de uso del rol, leídos en el código.")
    for c in D.CASOS:
        d.add_heading(f"{c['id']} {c['nombre']}", 1)
        tabla(d, ["Campo", "Contenido"], [
            ["Objetivo", c["objetivo"]], ["Actor", D.ROL["nombre"]], ["Funcionalidad", c["funcionalidad"]],
            ["Precondiciones", c["precondiciones"]], ["Resultado esperado", c["resultado"]],
            ["Flujos alternativos", " / ".join(c["fa"]) or "-"], ["Flujos de excepción", " / ".join(c["fe"]) or "-"],
            ["Reglas", ", ".join(c["rn"]) or "-"], ["Trazabilidad", " | ".join(c["traz"])],
            ["Observado al capturar", c["observado"]],
        ], [4, 12.5])
        d.add_paragraph("Flujo principal:").runs[0].bold = True
        lista_numerada(d, c["flujo"])
    guardar(d, f"02_Casos_de_Uso/Casos_de_Uso_{D.ROL['archivo']}.docx")


# ---------- QA ----------
NEGATIVAS = [
    ["QA-N1", "Publicación bajo subdirectorio", "Compilar con VITE_BASE=/coipo_notebooklm/ y abrir #/infografias.", "Las miniaturas cargan.", "P-001"],
    ["QA-N2", "Sin JavaScript", "Abrir el sitio con JavaScript desactivado.", "Se lee el aviso de noscript.", "-"],
    ["QA-N3", "localStorage bloqueado", "Bloquear el almacenamiento del sitio y cambiar el sistema.", "El cambio funciona; no se recuerda al recargar.", "-"],
    ["QA-N4", "Gate de publicación", "Poner un valor ficticio SID=xxxxxxxxxxxxxxxxxxxxxxxx en un archivo de una copia de dist y correr npm run check:publish.", "El gate falla.", "-"],
]


def qa():
    d = doc_nuevo("Checklist de QA", "Una ficha por caso de uso y pruebas negativas. Todas parten en NOT TESTED.")
    d.add_heading("Cómo usar este checklist", 1)
    d.add_paragraph("Marque OK, FALLA o NO APLICA en cada ficha. «Observado al capturar» dice lo que se vio al generar el "
                    "paquete; no reemplaza la prueba. No hay proveedor de identidad ni concurrencia que probar: el sitio "
                    "es estático y sin sesión.")
    for c in D.CASOS:
        d.add_heading(f"Ficha {c['id']}: {c['nombre']}", 1)
        tabla(d, ["Campo", "Valor"], [["Precondiciones", c["precondiciones"]], ["Resultado esperado", c["resultado"]],
                                      ["Estado", "NOT TESTED"], ["Observado al capturar", c["observado"]],
                                      ["Probador / fecha", ""], ["Notas", ""]], [4, 12.5])
        d.add_paragraph("Pasos:").runs[0].bold = True
        lista_numerada(d, c["flujo"])
    d.add_heading("Pruebas negativas", 1)
    tabla(d, ["Id", "Prueba", "Pasos", "Esperado", "Problema"], NEGATIVAS, [1.4, 3, 6, 4, 2])
    guardar(d, "03_QA/Checklist_QA.docx")


# ---------- XLSX ----------
def xlsx():
    wb = Workbook()
    hojas = [
        ("Trazabilidad", ["Caso", "Nombre", "Funcionalidad", "Pantalla", "Archivo", "Datos", "Reglas"],
         [[c["id"], c["nombre"], c["funcionalidad"], c["traz"][2], c["traz"][3], c["traz"][4], ", ".join(c["rn"])] for c in D.CASOS]),
        ("Checklist", ["Caso", "Nombre", "Estado", "Observado al capturar", "Probador", "Fecha"],
         [[c["id"], c["nombre"], "NOT TESTED", c["observado"], "", ""] for c in D.CASOS] + [[n[0], n[1], "NOT TESTED", "", "", ""] for n in NEGATIVAS]),
        ("Permisos", ["Acción", "Usuario"], [[f["nombre"], "Sí"] for f in D.FUNCIONALIDADES]),
        ("Reglas", ["Id", "Nombre", "Descripción", "Dónde vive"], D.REGLAS),
        ("Hallazgos", ["Id", "Título", "Gravedad", "Evidencia", "Certeza", "Estado"],
         [[p["id"], p["titulo"], p["gravedad"], p["evidencia"], p["certeza"], p["estado"]] for p in P.PROBLEMAS]),
        ("Cobertura", ["Funcionalidad", "Casos", "Cubierta"], cobertura()),
    ]
    wb.remove(wb.active)
    for nombre, cab, filas in hojas:
        ws = wb.create_sheet(nombre); ws.append(cab)
        for f in filas:
            ws.append(f)
        for c in ws[1]:
            c.font = Font(bold=True); c.fill = PatternFill("solid", fgColor="DCE6F0")
        for col in ws.columns:
            ws.column_dimensions[col[0].column_letter].width = min(60, max(10, max(len(str(c.value or "")) for c in col) + 2))
            for c in col:
                c.alignment = Alignment(wrap_text=True, vertical="top")
        ws.freeze_panes = "A2"; ws.auto_filter.ref = ws.dimensions
    out = RAIZ_DOC / "04_Trazabilidad/Trazabilidad.xlsx"; out.parent.mkdir(parents=True, exist_ok=True); wb.save(out)


# ---------- textos ----------
def guion():
    txt = ("Esta es la guía de conexión con NotebookLM. Cualquier persona puede abrirla, sin crear cuenta ni iniciar sesión. "
           "Al entrar aparece la sección Qué es esto, que explica que se usa un cliente no oficial y por qué hay que tener cuidado. "
           "A la izquierda está el menú con quince secciones, desde la instalación hasta la solución de problemas. "
           "Arriba a la derecha puede elegir Windows o macOS y Linux, y todos los comandos cambian a su sistema. "
           "Cada bloque de código tiene un botón para copiarlo; si el navegador no lo permite, el botón le pide seleccionar y copiar a mano. "
           "En la galería hay quince infografías, once vídeos y seis audios generados con inteligencia artificial. "
           "Puede filtrar por tema, ampliar una infografía, pasar a la siguiente con las flechas y descargarla. "
           "En el teléfono, el menú se abre con el botón de tres líneas. Y si su sistema usa modo oscuro, el sitio también.")
    (RAIZ_DOC / "01_Manuales/Usuario_guion.txt").write_text(txt + "\n", encoding="utf-8")
    caps = ["01_inicio", "10_troubleshooting", "07_instalacion_windows", "08_instalacion_unix", "09_copiar",
            "02_infografias", "03_infografias_filtro", "04_visor_infografia", "05_videos", "06_audios", "13_movil_menu", "12_tema_oscuro"]
    (RAIZ_DOC / "01_Manuales/Usuario_capturas.txt").write_text("\n".join(f"{c}.png" for c in caps) + "\n", encoding="utf-8")
    return len(txt.split())


def guardar(d, rel):
    out = RAIZ_DOC / rel; out.parent.mkdir(parents=True, exist_ok=True); d.save(out)


def paginas_pdf():
    try:
        import fitz
    except ImportError:
        return {}
    return {p.name: fitz.open(p).page_count for p in sorted((RAIZ_DOC / "_pdf").glob("*.pdf"))}


def readme(palabras):
    pags = paginas_pdf()
    cub = sum(1 for f in cobertura() if f[2] == "Sí")
    abiertos = [p for p in P.PROBLEMAS if p["estado"] == "abierto"]
    lineas = [
        f"# Documentacion_Sistema2: {D.SISTEMA}", "",
        f"Versión {D.VERSION}, generada el {HOY}. Primera versión: no había paquete anterior en el repositorio.", "",
        "## Qué leer primero",
        "1. `01_Manuales/Manual_Usuario.docx`: cómo usar el sitio.",
        "2. `05_Problema_PlanMejora/PROBLEMAS.md`: lo que está roto, empezando por P-001.",
        "3. `00_Analisis/Analisis_Sistema.docx`: roles, reglas, hallazgos y cobertura.", "",
        "## Cifras (calculadas por `_generador/generar.py`)", "",
        "| Concepto | Valor |", "|---|---|",
        "| Roles con pantalla | 1 (Usuario) |",
        f"| Secciones del sitio | {len(D.SECCIONES)} |",
        f"| Funcionalidades | {len(D.FUNCIONALIDADES)} |",
        f"| Casos de uso | {len(D.CASOS)} |",
        f"| Fichas de QA | {len(D.CASOS)} + {len(NEGATIVAS)} negativas |",
        f"| Reglas | {len(D.REGLAS)} |",
        f"| Problemas abiertos | {len(abiertos)} |",
        f"| Capturas | {len(list(IMG.glob('*.png')))} |",
        f"| Cobertura | {cub} de {len(D.FUNCIONALIDADES)} funcionalidades con caso |",
        f"| Guion de vídeo | {palabras} palabras |",
    ]
    for n, c in pags.items():
        lineas.append(f"| Páginas de `_pdf/{n}` | {c} |")
    lineas += ["", "## Estructura", "",
               "- `00_Analisis/`: análisis e `INFORME_EJECUCION_<fecha>.md`.",
               "- `01_Manuales/`: manual del rol Usuario, guion de vídeo y lista de capturas.",
               "- `02_Casos_de_Uso/`, `03_QA/`, `04_Trazabilidad/` (planilla con panel inmovilizado y autofiltro).",
               "- `05_Problema_PlanMejora/`: `PROBLEMAS.md` y `PLAN_MEJORA.md`.",
               "- `_imagenes/`: capturas PNG de 1000 px a 144 ppp. `_pdf/`: PDF con índice calculado.",
               "- `_generador/`: todo lo necesario para regenerar.", "",
               "## Cómo se regenera", "",
               "Desde la raíz del repositorio, en PowerShell:", "",
               "```",
               "# 1. Capturas (opcional): servir frontend/dist en 127.0.0.1:18100, un compilado con",
               "#    VITE_BASE=/coipo_notebooklm/ en 127.0.0.1:18101/coipo_notebooklm/, y Chrome headless",
               "#    con --remote-debugging-port=18102 --host-resolver-rules=\"MAP * ~NOTFOUND , EXCLUDE 127.0.0.1\"",
               "python docs/Documentacion_Sistema2/_generador/capturar.py docs/Documentacion_Sistema2/_imagenes",
               "python docs/Documentacion_Sistema2/_generador/generar.py",
               "python docs/Documentacion_Sistema2/_generador/exportar_pdf.py   # Word por COM, un proceso por documento",
               "python docs/Documentacion_Sistema2/_generador/generar.py        # de nuevo: escribe las páginas en este README",
               "python docs/Documentacion_Sistema2/_generador/validar.py",
               "```", "",
               "No se usa producción, ni Google real, ni la red: las capturas se hacen en local con los hosts externos bloqueados.", ""]
    (RAIZ_DOC / "README.md").write_text("\n".join(lineas), encoding="utf-8")


if __name__ == "__main__":
    analisis(); manual(); casos(); qa(); xlsx()
    n = guion()
    P.escribir(RAIZ_DOC / "05_Problema_PlanMejora", HOY)
    readme(n)
    print("generado en", RAIZ_DOC, "| palabras del guion:", n)
