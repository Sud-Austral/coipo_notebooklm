# -*- coding: utf-8 -*-
"""Exporta cada DOCX del paquete a _pdf/ con Word 2007 por COM.

Word 2007 no exporta a PDF: se actualiza el índice y se imprime con PrintOut a la
impresora predeterminada «Microsoft Print to PDF» (no se cambia la predeterminada).
Cada documento usa un Word NUEVO (DispatchEx) en su propio proceso de Python y se
cierra con doc.Close() y app.Quit() sobre ese mismo objeto. Se espera al %%EOF.

    python exportar_pdf.py            # todos
    python exportar_pdf.py <docx> <pdf>   # uno (lo usa el propio script)
"""
import os, subprocess, sys, time
from pathlib import Path

RAIZ_DOC = Path(__file__).resolve().parent.parent


def uno(docx, pdf):
    import pythoncom, win32com.client
    pythoncom.CoInitialize()
    app = win32com.client.DispatchEx("Word.Application")
    app.Visible = False; app.DisplayAlerts = 0
    doc = None
    try:
        doc = app.Documents.Open(str(docx), False, True)  # ConfirmConversions, ReadOnly
        for i in range(1, doc.TablesOfContents.Count + 1):
            doc.TablesOfContents(i).Update()
        doc.Repaginate()
        if os.path.exists(pdf):
            os.remove(pdf)
        # Background, Append, Range, OutputFileName, From, To, Item, Copies, Pages, PageType, PrintToFile
        doc.PrintOut(False, False, 0, str(pdf), "", "", 0, 1, "", 0, True)
        for _ in range(240):
            time.sleep(0.5)
            if os.path.exists(pdf) and os.path.getsize(pdf) > 0:
                with open(pdf, "rb") as f:
                    f.seek(max(0, os.path.getsize(pdf) - 1024))
                    if b"%%EOF" in f.read():
                        break
        else:
            raise SystemExit(f"sin %%EOF: {pdf}")
    finally:
        if doc is not None:
            doc.Close(0)
        app.Quit()
        pythoncom.CoUninitialize()
    print("ok", pdf)


if __name__ == "__main__":
    if len(sys.argv) == 3:
        uno(Path(sys.argv[1]), Path(sys.argv[2]))
    else:
        out = RAIZ_DOC / "_pdf"; out.mkdir(exist_ok=True)
        for docx in sorted(RAIZ_DOC.glob("0*/*.docx")):
            pdf = out / (docx.stem + ".pdf")
            r = subprocess.run([sys.executable, __file__, str(docx), str(pdf)])
            if r.returncode:
                sys.exit(f"falló {docx.name}")
