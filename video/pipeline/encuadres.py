# -*- coding: utf-8 -*-
"""Del bbox oficial de cada región al lat/lon/z que la encuadra en el visor.

Sustituye a los encuadres escritos a mano. Aquellos eran constantes del tipo
{x: 403, y: 830, k: 2.40} sacadas mirando una captura: se rompen en cuanto la
app mueva el mapa, y con vídeos recurrentes eso pasa seguro.

Aquí el encuadre se CALCULA del bbox que publica el propio ETL en el manifest,
y se le pide al visor por query string (frontend/src/urlState.js acepta
?lat=&lon=&z=). La captura sale bien compuesta de origen y la composición del
vídeo no necesita saber dónde cae el país.

Ojo: urlState.js lee el zoom con parseInt, así que z va entero.
"""
import io, json, math, os

MANIFEST = r"C:\Users\luis.monsalve\Documents\GitHub\coipo_vista_catastro\frontend\public\datos\manifest.json"

# El área de mapa del visor dentro del cuadro de 1920×1080: entre el panel de
# filtros (565) y el de indicadores (1585), bajo el banner (108).
PANEL_W, PANEL_H = 1020, 972
MARGEN = 0.86          # aire alrededor del sujeto; sin esto toca los bordes


def _merc(lat):
    lat = max(min(lat, 85.05), -85.05)
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def encuadrar(bbox, w=PANEL_W, h=PANEL_H, margen=MARGEN):
    """(lon, lat, zoom_entero) que mete el bbox dentro del área de mapa."""
    lon0, lat0, lon1, lat1 = bbox
    dlon = abs(lon1 - lon0)
    dy = abs(_merc(lat1) - _merc(lat0)) * 180 / math.pi
    z = min(math.log2(w * 360.0 / (256.0 * dlon)),
            math.log2(h * 360.0 / (256.0 * dy))) + math.log2(margen)
    lat_c = math.degrees(2 * math.atan(math.exp((_merc(lat0) + _merc(lat1)) / 2)) - math.pi / 2)
    return round((lon0 + lon1) / 2, 4), round(lat_c, 4), int(math.floor(z))


def cargar():
    return json.load(io.open(MANIFEST, encoding='utf-8'))


def nacional(m=None):
    m = m or cargar()
    r = m['regiones']
    bbox = [min(x['bbox'][0] for x in r), min(x['bbox'][1] for x in r),
            max(x['bbox'][2] for x in r), max(x['bbox'][3] for x in r)]
    return encuadrar(bbox)


def region(cod, m=None):
    m = m or cargar()
    r = next(x for x in m['regiones'] if x['cod'] == cod)
    return encuadrar(r['bbox'])


def query(cod=None, **extra):
    """Query string con el encuadre ya calculado."""
    lon, lat, z = region(cod) if cod else nacional()
    p = []
    if cod:
        p.append('reg=%s' % cod)
    p += ['lat=%s' % lat, 'lon=%s' % lon, 'z=%d' % z]
    p += ['%s=%s' % (k, v) for k, v in extra.items()]
    return '?' + '&'.join(p)


if __name__ == '__main__':
    m = cargar()
    print('nacional      ', query())
    for cod in ('09', '14'):
        nom = next(x['nombre'] for x in m['regiones'] if x['cod'] == cod)
        print('%-14s' % nom, query(cod))
