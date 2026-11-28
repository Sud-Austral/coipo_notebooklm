# -*- coding: utf-8 -*-
"""Validación estructural del paquete. Sale con código 1 si algo falla.

    python validar.py [--png <carpeta>]   # --png rasteriza páginas de riesgo para mirarlas
"""
import re, sys, os
from pathlib import Path
import fitz
from docx import Document
from openpyxl import load_workbook

sys.path.insert(0, os.path.dirname(__file__))
import datos as D, problemas as P, generar as G  # noqa: E402

R = G.RAIZ_DOC
errores = []


def mal(m):
    errores.append(m); print("FALLA:", m)


# capturas: toda referenciada existe y toda existente está referenciada
pngs = {p.stem for p in (R / "_imagenes").glob("*.png")}
if set(G.PIES) != pngs:
    mal(f"pies sin archivo {set(G.PIES) - pngs} / archivos sin pie {pngs - set(G.PIES)}")
lista = (R / "01_Manuales/Usuario_capturas.txt").read_text(encoding="utf-8").split()
if len(lista) != len(set(lista)) or any(Path(x).stem not in pngs for x in lista):
    mal("Usuario_capturas.txt con repetidos o inexistentes")
pal = len((R / "01_Manuales/Usuario_guion.txt").read_text(encoding="utf-8").split())
if not 130 <= pal <= 170:
    mal(f"guion con {pal} palabras")
# ids únicos, reglas definidas, funcionalidades existentes
ids = [c["id"] for c in D.CASOS]
if len(ids) != len(set(ids)): mal("ids de caso duplicados")
rn = {r[0] for r in D.REGLAS}
if len(rn) != len(D.REGLAS): mal("ids de regla duplicados")
for c in D.CASOS:
    for x in c["rn"]:
        if x not in rn: mal(f"{c['id']} cita {x} sin definir")
    if c["funcionalidad"] not in {f["nombre"] for f in D.FUNCIONALIDADES}: mal(f"{c['id']} funcionalidad inexistente")
for f in D.FUNCIONALIDADES:
    if f["captura"] not in pngs: mal(f"captura {f['captura']} inexistente")
# problemas <-> plan
plan = (R / "05_Problema_PlanMejora/PLAN_MEJORA.md").read_text(encoding="utf-8")
probs = (R / "05_Problema_PlanMejora/PROBLEMAS.md").read_text(encoding="utf-8")
if set(re.findall(r"## (P-\d{3})", plan)) != {p["id"] for p in P.PROBLEMAS if p["estado"] == "abierto"}: mal("plan y problemas no calzan")
if set(re.findall(r"\| (P-\d{3}) \|", probs)) != {p["id"] for p in P.PROBLEMAS}: mal("PROBLEMAS.md incompleto")
# DOCX / PDF
for docx in sorted(R.glob("0*/*.docx")):
    d = Document(docx)
    texto = "\n".join(p.text for p in d.paragraphs) + "\n".join(c.text for t in d.tables for r in t.rows for c in r.cells)
    imgs = len(d.inline_shapes)
    if "CAPTURA FALTANTE" in texto: mal(f"{docx.name}: captura faltante")
    pdf = R / "_pdf" / (docx.stem + ".pdf")
    pd = fitz.open(pdf); ptxt = "".join(pg.get_text() for pg in pd)
    if "Actualizar campo" in ptxt: mal(f"{pdf.name}: índice sin calcular")
    dobles = re.findall(r"\w*[áéíóú]\w*[áéíóú]\w*", ptxt.lower())
    if dobles: mal(f"{pdf.name}: palabras con dos tildes {set(dobles)}")
    print(f"{docx.name}: {pd.page_count} págs, {len(d.tables)} tablas, {imgs} imágenes")
wb = load_workbook(R / "04_Trazabilidad/Trazabilidad.xlsx")
for ws in wb:
    if ws.freeze_panes != "A2" or not ws.auto_filter.ref: mal(f"hoja {ws.title} sin panel o filtro")
print("hojas:", wb.sheetnames)

if "--png" in sys.argv:
    out = Path(sys.argv[sys.argv.index("--png") + 1]); out.mkdir(parents=True, exist_ok=True)
    for nombre, buscar in [("Analisis_Sistema", "Matriz de permisos"), ("Analisis_Sistema", "Hallazgos al mirar"),
                           ("Manual_Usuario", "Ampliar una infografía"), ("Checklist_QA", "Ficha CU-07"),
                           ("Analisis_Sistema", None), ("Manual_Usuario", "Usar el sitio en el tel")]:
        pd = fitz.open(R / "_pdf" / f"{nombre}.pdf")
        pags = [i for i, pg in enumerate(pd) if buscar and buscar in pg.get_text()]
        i = pags[-1] if pags else 1  # la última aparición: la primera suele ser el índice
        pd[i].get_pixmap(dpi=80).save(out / f"{nombre}_{i + 1}.png")
        print("rasterizada", nombre, i + 1)
sys.exit(1 if errores else 0)
