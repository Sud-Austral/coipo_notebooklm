# -*- coding: utf-8 -*-
"""Capturas del sitio por CDP (Chrome headless ya levantado en el puerto 18102).

Uso: python capturar.py <carpeta_salida>
Requisitos: sitio servido en 127.0.0.1:18100 (dist en la raíz) y 127.0.0.1:18101
(dist compilado con VITE_BASE=/coipo_notebooklm/ bajo /coipo_notebooklm/).
Chrome se arranca con --host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"
y además este script bloquea por CDP toda URL que no sea 127.0.0.1.
Escribe un registro JSON con las peticiones fallidas y bloqueadas.
"""
import base64, io, json, sys, time, urllib.request
import websocket
from PIL import Image

OUT = sys.argv[1]
BASE = "http://127.0.0.1:18100/"
PAGES = "http://127.0.0.1:18101/coipo_notebooklm/"

req = urllib.request.Request("http://127.0.0.1:18102/json/new?about:blank", method="PUT")
tab = json.loads(urllib.request.urlopen(req).read())
ws = websocket.create_connection(tab["webSocketDebuggerUrl"], timeout=30)
_id = [0]
eventos = []


def cdp(method, **params):
    _id[0] += 1
    ws.send(json.dumps({"id": _id[0], "method": method, "params": params}))
    while True:
        m = json.loads(ws.recv())
        if m.get("id") == _id[0]:
            if "error" in m:
                raise RuntimeError(f"{method}: {m['error']}")
            return m.get("result", {})
        eventos.append(m)


def drenar(seg):
    fin = time.time() + seg
    ws.settimeout(0.2)
    while time.time() < fin:
        try:
            eventos.append(json.loads(ws.recv()))
        except Exception:
            pass
    ws.settimeout(30)


def js(expr):
    r = cdp("Runtime.evaluate", expression=expr, awaitPromise=True, returnByValue=True)
    return r.get("result", {}).get("value")


def viewport(w, h, movil=False):
    cdp("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=1, mobile=movil)


def ir(url, espera=1.5):
    cdp("Page.navigate", url=url)
    drenar(espera)


def foto(nombre):
    data = base64.b64decode(cdp("Page.captureScreenshot", format="png")["data"])
    im = Image.open(io.BytesIO(data)).convert("RGB")
    if im.width != 1000:
        alto = round(im.height * 1000 / im.width)
        im = im.resize((1000, alto), Image.LANCZOS)
    im.save(f"{OUT}/{nombre}.png", dpi=(144, 144))
    print("captura", nombre, im.size)


cdp("Page.enable"); cdp("Network.enable"); cdp("Runtime.enable")
cdp("Fetch.enable", patterns=[{"urlPattern": "*"}])
# Fetch intercepta todo: se deja pasar lo local y se corta lo externo.
_orig_cdp = cdp


def cdp(method, **params):  # noqa: F811  (envoltorio que atiende Fetch.requestPaused)
    _id[0] += 1
    mid = _id[0]
    ws.send(json.dumps({"id": mid, "method": method, "params": params}))
    while True:
        m = json.loads(ws.recv())
        if m.get("method") == "Fetch.requestPaused":
            atender(m)
            continue
        if m.get("id") == mid:
            if "error" in m:
                raise RuntimeError(f"{method}: {m['error']}")
            return m.get("result", {})
        eventos.append(m)


bloqueadas = []


def atender(m):
    p = m["params"]
    url = p["request"]["url"]
    _id[0] += 1
    if url.startswith("http://127.0.0.1:"):
        ws.send(json.dumps({"id": _id[0], "method": "Fetch.continueRequest", "params": {"requestId": p["requestId"]}}))
    else:
        bloqueadas.append(url)
        ws.send(json.dumps({"id": _id[0], "method": "Fetch.failRequest",
                            "params": {"requestId": p["requestId"], "errorReason": "BlockedByClient"}}))


def drenar(seg):  # noqa: F811
    fin = time.time() + seg
    ws.settimeout(0.2)
    while time.time() < fin:
        try:
            m = json.loads(ws.recv())
            if m.get("method") == "Fetch.requestPaused":
                atender(m)
            else:
                eventos.append(m)
        except Exception:
            pass
    ws.settimeout(30)


viewport(1280, 860)
ir(BASE)
js("localStorage.setItem('coipo-docs-platform','windows'); 1")
cdp("Emulation.setEmulatedMedia", features=[{"name": "prefers-color-scheme", "value": "light"}])

ir(BASE + "#/que-es"); foto("01_inicio")
ir(BASE + "#/infografias", 2.5); foto("02_infografias")
js("[...document.querySelectorAll('.filtros button')][2].click(); 1"); drenar(1.5); foto("03_infografias_filtro")
js("[...document.querySelectorAll('.filtros button')][0].click(); document.querySelector('.tarjeta__boton').click(); 1")
drenar(2.5); foto("04_visor_infografia")
js("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); 1"); drenar(0.5)
ir(BASE + "#/videos", 2.5); foto("05_videos")
ir(BASE + "#/audios", 1.5); foto("06_audios")
ir(BASE + "#/instalacion"); foto("07_instalacion_windows")
js("[...document.querySelectorAll('.platform button')][1].click(); 1"); drenar(0.8); foto("08_instalacion_unix")
js("[...document.querySelectorAll('.platform button')][0].click(); 1"); drenar(0.5)
js("document.querySelector('.copybtn').click(); 1"); drenar(0.4)
estado_copia = js("document.querySelector('.copybtn').textContent")
print("botón copiar tras clic:", estado_copia)
foto("09_copiar")
ir(BASE + "#/troubleshooting"); foto("10_troubleshooting")
ir(BASE + "#/no-existe"); foto("11_seccion_inexistente")
cdp("Emulation.setEmulatedMedia", features=[{"name": "prefers-color-scheme", "value": "dark"}])
ir(BASE + "#/que-es"); foto("12_tema_oscuro")
cdp("Emulation.setEmulatedMedia", features=[{"name": "prefers-color-scheme", "value": "light"}])
viewport(390, 760, True)
ir(BASE + "#/que-es"); js("document.querySelector('.iconbtn').click(); 1"); drenar(0.8); foto("13_movil_menu")
viewport(1280, 860)
eventos.clear()
ir(PAGES + "#/infografias", 3); foto("14_pages_galeria_rota")
fallos = []
for e in eventos:
    if e.get("method") == "Network.responseReceived":
        r = e["params"]["response"]
        if r["status"] >= 400:
            fallos.append([r["status"], r["url"]])
roto = js("[...document.images].filter(i=>i.complete && i.naturalWidth===0).length")
total = js("document.images.length")
registro = {"copiar": estado_copia, "pages_404": fallos, "pages_imgs_rotas": roto,
            "pages_imgs_total": total, "bloqueadas_externas": bloqueadas}
json.dump(registro, open(f"{OUT}/_registro_capturas.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps({k: (v if k != "pages_404" else v[:4]) for k, v in registro.items()}, ensure_ascii=False))
print("404 en pages:", len(fallos))
ws.close()
