# -*- coding: utf-8 -*-
"""Rehace los planos de modal.

El intento anterior los cerraba pinchando «×» y ése botón, cuando no hay modal
abierto, es el que cierra el PANEL entero: los cuatro planos salieron idénticos
con el panel plegado. Aquí se cierra con Escape y se comprueba que el panel
sigue en pie antes de cada plano.
"""
import time
from capturar import Cdp, lanzar, esperar_carga, URL, SALIDA  # noqa: F401
from capturar_todo import AYUDA, preparar


def escape(cdp):
    for tipo in ("keyDown", "keyUp"):
        cdp.enviar("Input.dispatchKeyEvent", type=tipo, key="Escape",
                   code="Escape", windowsVirtualKeyCode=27, nativeVirtualKeyCode=27)
    time.sleep(0.7)


def panel_abierto(cdp):
    return cdp.js("!!document.querySelector('button') && "
                  "[...document.querySelectorAll('button')].some("
                  "e => /Descargar/.test(e.innerText||''))")


def asegurar_panel(cdp):
    if not panel_abierto(cdp):
        cdp.js("window.__click('button','\\u2630')")   # el tirador ☰
        time.sleep(1.0)
    return panel_abierto(cdp)


if __name__ == '__main__':
    proc, cdp = lanzar()
    try:
        cdp.enviar("Page.enable"); cdp.enviar("Runtime.enable"); cdp.retina()
        esperar_carga(cdp); preparar(cdp)

        for nombre, etiqueta, espera in [
            ("10_especie_modal", "Especie", 2.0),
            ("11_territorio", "Territorio", 2.0),
            ("12_descargar", "Descargar", 1.8),
            ("13_compartir", "Compartir", 1.8),
            ("14_informacion", "Información", 2.6),
        ]:
            if not asegurar_panel(cdp):
                print("  !! el panel no volvió a abrirse antes de %s" % nombre)
                break
            abierto = cdp.js("window.__click('button', %r)" % etiqueta)
            time.sleep(espera)
            # Comprobación real: ¿cambió algo? Si no, no hubo modal.
            texto = cdp.js("document.body.innerText.length")
            print("  %s: click=%s, texto=%d" % (nombre, abierto, texto))
            cdp.foto(nombre)
            escape(cdp)
    finally:
        cdp.cerrar(); proc.terminate()
