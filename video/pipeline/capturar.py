# -*- coding: utf-8 -*-
"""Capturas del visor del Catastro, por CDP, a 1920x1080.

Reutiliza la idea del arnés del propio repo (spike/medir.py): Chrome headless
con swiftshader —deck.gl necesita WebGL y sin ese flag el contexto no se crea—
y control por CDP. A diferencia del arnés, aquí NO se bloquean las teselas:
queremos el mapa bonito, no una medición reproducible.
"""
import base64, io, json, os, subprocess, sys, tempfile, time
import requests
import websocket

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
URL = "https://sud-austral.github.io/coipo_vista_catastro/"
ANCHO, ALTO = 1920, 1080
SALIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'capturas')


class Cdp:
    def __init__(self, ws_url):
        self.ws = websocket.create_connection(
            ws_url, timeout=120, max_size=200 * 1024 * 1024, suppress_origin=True)
        self.n = 0

    def enviar(self, metodo, **params):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                if "error" in msg:
                    raise RuntimeError("%s: %s" % (metodo, msg["error"]))
                return msg.get("result", {})

    def js(self, expr):
        r = self.enviar("Runtime.evaluate", expression=expr,
                        returnByValue=True, awaitPromise=True)
        if r.get("exceptionDetails"):
            raise RuntimeError("JS: %s" % r["exceptionDetails"].get("text"))
        return r.get("result", {}).get("value")

    def retina(self, escala=2):
        self.enviar("Emulation.setDeviceMetricsOverride", width=ANCHO, height=ALTO,
                    deviceScaleFactor=escala, mobile=False)

    def foto(self, nombre):
        os.makedirs(SALIDA, exist_ok=True)
        r = self.enviar("Page.captureScreenshot", format="png", captureBeyondViewport=False)
        ruta = os.path.join(SALIDA, nombre + ".png")
        open(ruta, "wb").write(base64.b64decode(r["data"]))
        print("  -> %s  (%.0f KB)" % (nombre, os.path.getsize(ruta) / 1024))
        return ruta

    def cerrar(self):
        try: self.ws.close()
        except Exception: pass


def lanzar():
    perfil = tempfile.mkdtemp(prefix="captura-chrome-")
    args = [CHROME, "--user-data-dir=%s" % perfil, "--remote-debugging-port=0",
            "--no-first-run", "--no-default-browser-check", "--disable-extensions",
            "--disable-background-networking", "--disable-sync",
            "--window-size=%d,%d" % (ANCHO, ALTO), "--hide-scrollbars",
            "--headless=new", "--force-device-scale-factor=1",
            "--enable-unsafe-swiftshader", "--use-angle=swiftshader", URL]
    proc = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    pf = os.path.join(perfil, "DevToolsActivePort")
    for _ in range(300):
        if os.path.exists(pf):
            try:
                puerto = int(open(pf).read().split("\n")[0])
                break
            except Exception:
                pass
        if proc.poll() is not None:
            raise RuntimeError("Chrome murió con código %s" % proc.returncode)
        time.sleep(0.1)
    else:
        raise RuntimeError("Chrome no publicó DevToolsActivePort")
    for _ in range(100):
        try:
            objetivos = requests.get("http://127.0.0.1:%d/json" % puerto, timeout=3).json()
            pagina = [t for t in objetivos if t.get("type") == "page"]
            if pagina:
                return proc, Cdp(pagina[0]["webSocketDebuggerUrl"])
        except Exception:
            pass
        time.sleep(0.2)
    raise RuntimeError("no apareció ninguna pestaña")


def esperar_carga(cdp, limite=180):
    """El visor descarga un binario de ~49 MB antes de pintar nada."""
    t0 = time.time()
    while time.time() - t0 < limite:
        listo = cdp.js("""(() => {
            const t = document.body ? document.body.innerText : '';
            if (/Cargando el Catastro/i.test(t)) return false;
            return !!document.querySelector('canvas');
        })()""")
        if listo:
            time.sleep(4)   # que deck.gl termine de pintar los puntos
            print("  cargado en %.1f s" % (time.time() - t0))
            return True
        time.sleep(1)
    raise RuntimeError("el visor no cargó en %d s" % limite)


def inventario(cdp):
    """Vuelca la interfaz real para no adivinar selectores."""
    return cdp.js("""(() => {
      const lim = s => (s||'').replace(/\\s+/g,' ').trim().slice(0,70);
      const q = s => Array.from(document.querySelectorAll(s));
      return {
        titulo: document.title,
        h: q('h1,h2,h3').map(e => e.tagName+': '+lim(e.innerText)).slice(0,40),
        botones: q('button').map((e,i) => i+' | '+lim(e.innerText||e.getAttribute('aria-label')||e.title)).slice(0,60),
        selects: q('select').map(e => lim(e.previousElementSibling && e.previousElementSibling.innerText)+' => ['+
                   Array.from(e.options).map(o=>o.text).slice(0,8).join(', ')+']').slice(0,12),
        enlaces: q('a').map(e => lim(e.innerText)).filter(Boolean).slice(0,25),
        summary: q('summary,[role=tab]').map(e => lim(e.innerText)).slice(0,30),
      };
    })()""")


if __name__ == '__main__':
    proc, cdp = lanzar()
    try:
        cdp.enviar("Page.enable")
        cdp.enviar("Runtime.enable")
        print("esperando a que cargue el Catastro nacional…")
        esperar_carga(cdp)
        cdp.foto("00_inicio")
        inv = inventario(cdp)
        io.open(os.path.join(SALIDA, 'inventario.json'), 'w', encoding='utf-8').write(
            json.dumps(inv, ensure_ascii=False, indent=1))
        print('  inventario escrito')
    finally:
        cdp.cerrar()
        proc.terminate()
