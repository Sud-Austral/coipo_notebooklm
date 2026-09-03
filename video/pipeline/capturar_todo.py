# -*- coding: utf-8 -*-
"""Secuencia de capturas del visor del Catastro, una por plano del vídeo.

El estado del visor viaja en la query string (frontend/src/urlState.js), así que
los planos que cambian de ámbito o de clase se dirigen por URL —determinista— y
sólo los paneles y modales se abren pinchando.
"""
import time
from capturar import Cdp, lanzar, esperar_carga, URL, SALIDA  # noqa: F401
import capturar

AYUDA = """
window.__click = (sel, txt) => {
  const n = [...document.querySelectorAll(sel)].find(
    e => (e.innerText||'').replace(/\\s+/g,' ').toLowerCase().includes(txt.toLowerCase()));
  if (!n) return false;
  n.scrollIntoView({block:'center'});
  n.click();
  return true;
};
window.__abrir = (txt) => {
  const s = [...document.querySelectorAll('summary')].find(
    e => (e.innerText||'').replace(/\\s+/g,' ').toLowerCase().includes(txt.toLowerCase()));
  if (!s) return false;
  if (!s.parentElement.open) s.click();
  s.scrollIntoView({block:'start'});
  return true;
};
window.__entendido = () => { window.__click('button','Entendido'); return true; };
true
"""


def preparar(cdp):
    cdp.js(AYUDA)
    cdp.js("window.__entendido()")
    time.sleep(0.8)


def cargar(cdp, query=""):
    """Navega y espera de nuevo: el .bin se relee en cada carga."""
    cdp.enviar("Page.navigate", url=URL + query)
    time.sleep(2)
    esperar_carga(cdp)
    preparar(cdp)


PLANOS = []


def plano(cdp, nombre, antes=None, espera=1.2):
    if antes:
        cdp.js(antes)
        time.sleep(espera)
    cdp.foto(nombre)
    PLANOS.append(nombre)


if __name__ == '__main__':
    proc, cdp = lanzar()
    try:
        cdp.enviar("Page.enable"); cdp.enviar("Runtime.enable"); cdp.retina()
        print("· vista nacional")
        esperar_carga(cdp); preparar(cdp)
        plano(cdp, "01_nacional")

        # El panel de indicadores, sección por sección.
        print("· indicadores")
        plano(cdp, "02_clases",   "window.__abrir('De qué está hecho Chile')")
        plano(cdp, "03_bosque",   "window.__abrir('Cuánto de Chile es bosque')")
        plano(cdp, "04_adentro",  "window.__abrir('Cómo es el bosque nativo por dentro')")
        plano(cdp, "05_tipos",    "window.__abrir('Tipos forestales')")
        plano(cdp, "06_especies", "window.__abrir('Especies dominantes')")
        plano(cdp, "07_snaspe",   "window.__abrir('Qué hay dentro del SNASPE')")
        plano(cdp, "08_simef",    "window.__abrir('Cambio de bosque nativo')")
        plano(cdp, "09_anios",    "window.__abrir('De cuándo es cada dato')")

        # Los modales de filtro y las tres acciones del panel.
        print("· modales")
        plano(cdp, "10_especie_modal", "window.__click('button','Especie')", 1.6)
        cdp.js("window.__click('button','×')"); time.sleep(0.6)
        plano(cdp, "11_territorio", "window.__click('button','Territorio')", 1.6)
        cdp.js("window.__click('button','×')"); time.sleep(0.6)
        plano(cdp, "12_descargar", "window.__click('button','Descargar')", 1.6)
        cdp.js("window.__click('button','×')"); time.sleep(0.6)
        plano(cdp, "13_compartir", "window.__click('button','Compartir')", 1.6)
        cdp.js("window.__click('button','×')"); time.sleep(0.6)
        plano(cdp, "14_informacion", "window.__click('button','Información')", 2.2)

        # Estados dirigidos por URL.
        print("· sólo bosques")
        cargar(cdp, "?usos=04"); plano(cdp, "15_solo_bosques")
        print("· La Araucanía")
        cargar(cdp, "?reg=09"); plano(cdp, "16_araucania")
        print("· Los Ríos, sólo bosque")
        cargar(cdp, "?reg=14&usos=04"); plano(cdp, "17_losrios_bosque")
        print("· fondo satelital")
        cargar(cdp, "?reg=09&base=Satélite"); plano(cdp, "18_satelite")

        print("\n%d planos en %s" % (len(PLANOS), SALIDA))
    finally:
        cdp.cerrar(); proc.terminate()
