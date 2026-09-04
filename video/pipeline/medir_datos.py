# -*- coding: utf-8 -*-
"""Mide DÓNDE están los datos en cada captura, para no encuadrar a ojo.

El error que corrige: los puntos de foco de los encuadres estaban escritos a
mano mirando dos capturas. Chile es una franja delgada a la izquierda del área
de mapa, así que centrar el VISOR no es centrar los DATOS: en varias secciones
el país quedaba en una esquina con el 70 % del cuadro vacío.

Aquí no se adivina. Los puntos del visor se dibujan con la paleta exacta de las
nueve clases de uso (COLOR_USO en frontend/src/config.js), así que se detectan
por color, se saca su caja envolvente y de ahí sale el encuadre.

Salida: focos.json  ->  { "03_bosque": {"x":…, "y":…, "w":…, "h":…}, … }
en coordenadas lógicas de 1920×1080 (las capturas son 3840×2160).
"""
import io, json, os, sys
import numpy as np
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
CAPTURAS = os.path.join(AQUI, '..', 'public', 'catastro')

# frontend/src/config.js -> COLOR_USO.claro
PALETA = ['#e34948', '#eda100', '#1baf7a', '#008300', '#4a3aa7',
          '#eb6834', '#2fb6dc', '#2a78d6', '#e87ba4',
          '#8d7ee8']            # el violeta del tema oscuro

# Zonas de interfaz que NO son mapa, en coordenadas lógicas.
BANNER_ALTO = 108
PANEL_IZQ = 565               # el panel de filtros, cuando está abierto
PANEL_DER = 1585              # el de indicadores

TOLERANCIA = 62               # distancia RGB; los discos van con alfa sobre el fondo
MINIMO_PIXELES = 400          # menos que esto es ruido, no una capa de datos


def rgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], dtype=np.int16)


def caja(ruta, recorte_izq=True):
    """Caja envolvente de los datos, en coordenadas lógicas 1920×1080."""
    im = Image.open(ruta).convert('RGB')
    ancho, alto = im.size
    esc = ancho / 1920.0
    a = np.asarray(im, dtype=np.int16)

    # DOS detectores, porque uno solo no sirve para los dos tipos de fondo.
    #
    # (a) Saturación. El fondo «Claro» del visor es gris puro: config.js lo mide
    #     y lo deja escrito —«la saturacion va entre 0 y 5 sobre 255 y no hay un
    #     solo pixel verde»—, así que cualquier píxel saturado es dato. Esto SÍ
    #     ve los puntos del norte, que son pequeños, aislados y quedan medio
    #     transparentes sobre el blanco.
    # (b) Color de la paleta. Necesario cuando el fondo es imagen satelital, que
    #     está saturada de por sí y dispara (a) en todo el cuadro.
    #
    # Medido: con sólo (b), el norte del país no se detectaba —cero píxeles por
    # encima de y=691— y la caja de Chile salía de 383 px de alto en vez de 900.
    mx = a.max(axis=2).astype(np.int16)
    mn = a.min(axis=2).astype(np.int16)
    sat = mx - mn                        # saturación en la escala 0–255
    m_sat = (sat > 22) & (mx > 60)

    m_pal = np.zeros(a.shape[:2], dtype=bool)
    for h in PALETA:
        m_pal |= np.abs(a - rgb(h)).sum(axis=2) < TOLERANCIA

    # Si la saturación se dispara en más de un cuarto del cuadro, el fondo es
    # imagen y no mapa: manda la paleta.
    fondo_imagen = m_sat.mean() > 0.25
    m = m_pal if fondo_imagen else (m_sat | m_pal)

    # Fuera la interfaz: banner, panel de filtros y panel de indicadores llevan
    # los mismos colores en leyendas y barras, y falsearían la caja.
    m[:int(BANNER_ALTO * esc), :] = False
    m[:, int(PANEL_DER * esc):] = False
    if recorte_izq:
        m[:, :int(PANEL_IZQ * esc)] = False

    ys, xs = np.nonzero(m)
    if len(xs) < MINIMO_PIXELES:
        # Con el panel cerrado los datos pueden vivir a la izquierda de 565.
        if recorte_izq:
            return caja(ruta, recorte_izq=False)
        return None

    # EXTENSIÓN, no densidad. El primer intento usaba percentiles sobre los
    # píxeles y salió mal: el sur del país concentra tantos puntos —Aysén tiene
    # 344.808 y Arica 5.946— que el percentil 1–99 devolvía una caja de 371 px
    # de alto para un país que ocupa 900. Aquí se mira el perfil por fila y por
    # columna y se toma el rango donde hay presencia real, que es lo que hay que
    # encuadrar.
    perfil_x = m.sum(axis=0)
    perfil_y = m.sum(axis=1)
    UMBRAL = 0.004                      # 0,4 % del pico: ignora píxeles sueltos
    cx = np.nonzero(perfil_x > perfil_x.max() * UMBRAL)[0]
    cy = np.nonzero(perfil_y > perfil_y.max() * UMBRAL)[0]
    x0, x1 = cx[0] / esc, cx[-1] / esc
    y0, y1 = cy[0] / esc, cy[-1] / esc
    return dict(x=round((x0 + x1) / 2, 1), y=round((y0 + y1) / 2, 1),
                w=round(x1 - x0, 1), h=round(y1 - y0, 1), n=int(len(xs)))


if __name__ == '__main__':
    focos = {}
    for f in sorted(os.listdir(CAPTURAS)):
        if not f.endswith('.png'):
            continue
        n = f[:-4]
        c = caja(os.path.join(CAPTURAS, f))
        if c:
            focos[n] = c
            print('%-20s centro (%6.1f, %6.1f)  caja %5.1f × %5.1f  %d px'
                  % (n, c['x'], c['y'], c['w'], c['h'], c['n']))
        else:
            print('%-20s SIN DATOS DETECTADOS' % n)
    io.open(os.path.join(AQUI, '..', 'src', 'focos.json'), 'w', encoding='utf-8').write(
        json.dumps(focos, ensure_ascii=False, indent=1))
    print('\n%d capturas medidas -> src/focos.json' % len(focos))
