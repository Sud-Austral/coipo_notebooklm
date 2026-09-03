# -*- coding: utf-8 -*-
"""Capturas del visor del Catastro, ya bien compuestas.

Diferencia con el intento anterior: NINGÚN encuadre está escrito a mano. Cada
vista se pide al visor con el lat/lon/z que sale del bbox oficial del manifest
(ver encuadres.py), así que el sujeto llega centrado en el área de mapa y la
composición del vídeo no tiene que recolocarlo después.

Antes: la vista nacional dejaba Chile pegado abajo a la izquierda con el 70 %
del cuadro en océano, y había que parchearlo con constantes por captura.
"""
import sys, time
from capturar import lanzar, esperar_carga, URL, SALIDA  # noqa: F401
from capturar_todo import AYUDA, preparar
import encuadres

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

NAC = encuadres.query()                                   # todo Chile, encuadrado
ARA = encuadres.query('09')                               # La Araucanía
RIO = encuadres.query('14')                               # Los Ríos


def ir(cdp, q):
    cdp.enviar("Page.navigate", url=URL + q)
    time.sleep(2)
    esperar_carga(cdp)
    preparar(cdp)


def plano(cdp, nombre, antes=None, espera=1.3):
    if antes:
        cdp.js(antes)
        time.sleep(espera)
    cdp.foto(nombre)


if __name__ == '__main__':
    proc, cdp = lanzar()
    try:
        cdp.enviar("Page.enable"); cdp.enviar("Runtime.enable"); cdp.retina()
        print('· vista nacional', NAC)
        ir(cdp, NAC)
        plano(cdp, "01_nacional")

        print('· panel de indicadores')
        for n, seccion in [("02_clases",   'De qué está hecho Chile'),
                           ("03_bosque",   'Cuánto de Chile es bosque'),
                           ("04_adentro",  'Cómo es el bosque nativo por dentro'),
                           ("05_tipos",    'Tipos forestales'),
                           ("06_especies", 'Especies dominantes'),
                           ("07_snaspe",   'Qué hay dentro del SNASPE'),
                           ("08_simef",    'Cambio de bosque nativo'),
                           ("09_anios",    'De cuándo es cada dato')]:
            plano(cdp, n, "window.__abrir(%r)" % seccion)

        print('· modales')
        def escape():
            for t in ("keyDown", "keyUp"):
                cdp.enviar("Input.dispatchKeyEvent", type=t, key="Escape", code="Escape",
                           windowsVirtualKeyCode=27, nativeVirtualKeyCode=27)
            time.sleep(0.7)

        for n, etiqueta, esp in [("10_especie_modal", "Especie", 2.0),
                                 ("11_territorio", "Territorio", 2.0),
                                 ("12_descargar", "Descargar", 1.8),
                                 ("13_compartir", "Compartir", 1.8),
                                 ("14_informacion", "Información", 2.6)]:
            if not cdp.js("[...document.querySelectorAll('button')].some(e=>/Descargar/.test(e.innerText||''))"):
                cdp.js("window.__click('button','\\u2630')"); time.sleep(1.0)
            plano(cdp, n, "window.__click('button', %r)" % etiqueta, esp)
            escape()

        print('· vistas dirigidas por URL, todas encuadradas')
        for q, n in [(NAC + '&usos=04',                  "15_solo_bosques"),
                     (ARA,                               "16_araucania"),
                     (RIO + '&usos=04',                  "17_losrios_bosque"),
                     (ARA + '&base=Satelital',           "18_satelite"),
                     (RIO + '&base=Sentinel-2&usos=04',  "19_sentinel")]:
            print('   ', n, q)
            ir(cdp, q)
            plano(cdp, n)

        print('\ncapturas en', SALIDA)
    finally:
        cdp.cerrar(); proc.terminate()
