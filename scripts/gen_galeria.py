"""Genera y descarga la galería de artefactos del sitio público.

Orquesta el lote completo: lanza lo que falte, espera a que Google termine y
descarga cada artefacto a frontend/public/galeria/, dejando un manifiesto que
consume la app React.

Es reanudable: guarda el estado en galeria-estado.json, así que si se corta a
mitad, la siguiente ejecución no vuelve a generar lo ya hecho.

    python scripts/gen_galeria.py --plan          # ver qué haría
    python scripts/gen_galeria.py --lanzar        # lanzar lo que falte
    python scripts/gen_galeria.py --esperar       # esperar y descargar
"""

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NLM = ROOT / ".venv" / "Scripts" / "nlm.exe"
if not NLM.exists():
    NLM = ROOT / ".venv" / "bin" / "nlm"

NOTEBOOK = "585db228-fcfa-46ea-85ca-68f9a8cf6f51"
DEST = ROOT / "frontend" / "public" / "galeria"
ESTADO = ROOT / "galeria-estado.json"
MANIFIESTO = ROOT / "frontend" / "src" / "data" / "galeria.js"

# --- Plan de contenidos -----------------------------------------------------
# Cada infografía combina estilo, orientación y foco distintos para que las 30
# no salgan clonadas.

TEMAS = [
    ("Parques nacionales de Chile", "parques-nacionales"),
    ("La araucaria: especie sagrada y monumento natural", "araucaria"),
    ("El alerce, uno de los árboles más longevos del planeta", "alerce"),
    ("Bosque valdiviano templado lluvioso", "bosque-valdiviano"),
    ("Bosque esclerófilo de la zona central", "bosque-esclerofilo"),
    ("Torres del Paine: geografía y biodiversidad", "torres-del-paine"),
    ("Parque nacional Conguillío", "conguillio"),
    ("CONAF y la gestión del patrimonio silvestre", "conaf"),
    ("Amenazas: incendios forestales y fragmentación", "amenazas"),
    ("Fauna asociada a los bosques nativos", "fauna"),
]

ESTILOS_INFO = [
    "scientific", "bento_grid", "editorial", "sketch_note", "professional",
    "instructional", "bricks", "clay", "anime", "kawaii",
]
ORIENTACIONES = ["landscape", "portrait", "square"]
DETALLES = ["standard", "detailed", "concise"]

ESTILOS_VIDEO = [
    "watercolor", "heritage", "classic", "whiteboard", "paper_craft",
    "retro_print", "anime", "kawaii", "auto_select", "classic",
]
FORMATOS_VIDEO = ["explainer", "brief", "explainer", "brief", "explainer",
                  "brief", "explainer", "brief", "explainer", "brief"]

FORMATOS_AUDIO = [
    ("brief", "short"), ("deep_dive", "default"), ("critique", "short"),
    ("debate", "default"), ("brief", "default"),
]


def plan():
    """Lista de specs a generar."""
    items = []

    for i in range(30):
        tema, slug = TEMAS[i % len(TEMAS)]
        items.append({
            "clave": f"info-{i:02d}",
            "tipo": "infographic",
            "tema": tema,
            "slug": slug,
            "args": [
                "--style", ESTILOS_INFO[i % len(ESTILOS_INFO)],
                "--orientation", ORIENTACIONES[i % len(ORIENTACIONES)],
                "--detail", DETALLES[(i // 3) % len(DETALLES)],
                "--focus", tema,
                "--language", "es",
            ],
            "estilo": ESTILOS_INFO[i % len(ESTILOS_INFO)],
            "orientacion": ORIENTACIONES[i % len(ORIENTACIONES)],
        })

    for i in range(10):
        tema, slug = TEMAS[i % len(TEMAS)]
        items.append({
            "clave": f"video-{i:02d}",
            "tipo": "video",
            "tema": tema,
            "slug": slug,
            "args": [
                "--format", FORMATOS_VIDEO[i],
                "--style", ESTILOS_VIDEO[i],
                "--focus", tema,
                "--language", "es",
            ],
            "estilo": ESTILOS_VIDEO[i],
        })

    for i, (formato, largo) in enumerate(FORMATOS_AUDIO):
        tema, slug = TEMAS[i % len(TEMAS)]
        items.append({
            "clave": f"audio-{i:02d}",
            "tipo": "audio",
            "tema": tema,
            "slug": slug,
            "args": ["--format", formato, "--length", largo, "--language", "es"],
            "estilo": formato,
        })

    return items


# --- Estado -----------------------------------------------------------------

def cargar_estado():
    return json.loads(ESTADO.read_text(encoding="utf-8")) if ESTADO.exists() else {}


def guardar_estado(estado):
    ESTADO.write_text(json.dumps(estado, indent=2, ensure_ascii=False), encoding="utf-8")


def nlm(*args, timeout=600):
    return subprocess.run([str(NLM), *args], capture_output=True, text=True,
                          timeout=timeout, encoding="utf-8", errors="replace")


# --- Acciones ---------------------------------------------------------------

def lanzar(estado, limite_n=0):
    # Reintenta también lo que falló antes: la cuota es por periodo, y esos
    # items deben poder relanzarse sin borrar el estado.
    pendientes = [i for i in plan()
                  if estado.get(i["clave"], {}).get("estado", "nuevo") in ("nuevo", "fallo")]
    if limite_n:
        pendientes = pendientes[:limite_n]
    print(f"lanzando {len(pendientes)} artefactos")

    lanzados = 0
    for item in pendientes:
        ok, detalle = crear(item)
        if ok:
            estado[item["clave"]] = {**item, "artifact_id": detalle,
                                     "estado": "generando"}
            print(f"  {item['clave']:<10} {item['estilo']:<14} -> {detalle}", flush=True)
            lanzados += 1
            guardar_estado(estado)
            time.sleep(PAUSA_ENTRE_CREACIONES)
            continue

        estado[item["clave"]] = {**item, "estado": "fallo", "error": detalle}
        guardar_estado(estado)
        if detalle == "rate_limit":
            # No sirve insistir: la cuota es por periodo. Se corta la tanda y el
            # ciclo volvera a intentarlo cuando se liberen huecos.
            print(f"  {item['clave']:<10} cuota agotada; corto la tanda", flush=True)
            break
        print(f"  {item['clave']:<10} FALLO: {detalle}", file=sys.stderr)

    return estado, lanzados


PAUSA_ENTRE_CREACIONES = 6.0


def crear(item):
    """(True, artifact_id) o (False, 'rate_limit' | mensaje)."""
    r = nlm(item["tipo"], "create", NOTEBOOK, *item["args"], "-y", "--json")
    bruto = r.stdout.strip()

    inicio = bruto.find("{")
    if inicio >= 0:
        try:
            data = json.loads(bruto[inicio:])
        except json.JSONDecodeError:
            data = {}
    else:
        data = {}

    if data.get("artifact_id"):
        return True, data["artifact_id"]

    mensaje = f"{data.get('error', '')} {r.stderr}".strip() or bruto[-160:]
    if "RESOURCE_EXHAUSTED" in mensaje or "ate limit" in mensaje:
        return False, "rate_limit"
    return False, mensaje.replace("\n", " ")[-160:]


def estado_remoto():
    """artifact_id -> dict del artefacto, saltándose el bug de nlm status."""
    from notebooklm_tools.cli.commands.studio import get_client
    from notebooklm_tools.services import studio
    import dataclasses

    with get_client(None) as client:
        res = studio.get_studio_status(client, NOTEBOOK, limit=100)
    data = dataclasses.asdict(res) if dataclasses.is_dataclass(res) else res
    return {a["artifact_id"]: a for a in data.get("artifacts", [])}


URL_KEYS = ("infographic_url", "video_url", "audio_url", "slide_deck_url")
EXT = {"infographic": ".png", "video": ".mp4", "audio": ".m4a"}
SUBCMD = {"infographic": "infographic", "video": "video", "audio": "audio"}


def adoptar(estado):
    """Registra artefactos que existen en el notebook pero no en el plan.

    La cuota de creacion es por cuenta y bastante estrecha, asi que las pruebas
    sueltas que se hicieron a mano ya la consumieron. Tirarlas seria desperdiciar
    generaciones que cuentan igual contra el limite.
    """
    conocidos = {i.get("artifact_id") for i in estado.values()}
    remoto = estado_remoto()
    adoptados = 0

    for artifact_id, art in remoto.items():
        if artifact_id in conocidos or art["type"] not in EXT:
            continue

        n = sum(1 for k in estado if k.startswith(f"extra-{art['type']}"))
        clave = f"extra-{art['type']}-{n:02d}"
        titulo = (art.get("title") or "").strip() or "Bosques y áreas protegidas de Chile"

        estado[clave] = {
            "clave": clave,
            "tipo": art["type"],
            "tema": titulo[:70],
            "slug": "extra",
            "estilo": "—",
            "orientacion": None,
            "artifact_id": artifact_id,
            "estado": "generando",
        }
        adoptados += 1
        print(f"  adoptado {clave:<22} {titulo[:45]}")

    guardar_estado(estado)
    print(f"adoptados {adoptados} artefactos fuera de plan")
    return estado


def revisar_y_descargar(estado):
    """Una pasada: baja lo que ya tiene URL. Devuelve cuántos siguen generando."""
    remoto = estado_remoto()
    generando = 0

    for clave, item in estado.items():
        if item.get("estado") == "descargado":
            continue
        art = remoto.get(item.get("artifact_id"))
        if not art:
            if item.get("estado") == "generando":
                generando += 1
            continue

        if art.get("error_reason"):
            item["estado"] = "fallo"
            item["error"] = art["error_reason"]
            continue

        if not any(art.get(k) for k in URL_KEYS):
            generando += 1
            continue

        destino = DEST / item["tipo"] / f"{clave}-{item['slug']}{EXT[item['tipo']]}"
        destino.parent.mkdir(parents=True, exist_ok=True)

        # optimizar_galeria.py aparta los PNG originales a media/galeria/ para
        # que Vite no los copie a dist/. Si ya estan alli, no hay que volver a
        # bajarlos.
        apartado = ROOT / "media" / "galeria" / item["tipo"] / destino.name
        if apartado.exists() and apartado.stat().st_size > 0:
            item["estado"] = "descargado"
            item["archivo"] = str(apartado.relative_to(ROOT)).replace("\\", "/")
            item["bytes"] = apartado.stat().st_size
            continue

        if not (destino.exists() and destino.stat().st_size > 0):
            r = nlm("download", SUBCMD[item["tipo"]], NOTEBOOK,
                    "--id", item["artifact_id"], "-o", str(destino), "--no-progress")
            if not (destino.exists() and destino.stat().st_size > 0):
                print(f"  fallo al bajar {clave}: "
                      f"{(r.stdout + r.stderr).strip()[-120:]}", file=sys.stderr)
                generando += 1
                continue

        item["estado"] = "descargado"
        item["archivo"] = str(destino.relative_to(ROOT)).replace("\\", "/")
        item["bytes"] = destino.stat().st_size
        print(f"  bajado {clave:<10} {item['bytes']:>11,} B", flush=True)

    guardar_estado(estado)
    return generando


def ciclo(estado, max_min):
    """Alterna descargar y lanzar hasta completar el plan.

    La API limita cuantos artefactos se crean por periodo, asi que no sirve
    lanzarlo todo de golpe: hay que ir metiendo los pendientes segun se liberan
    huecos.
    """
    limite = time.monotonic() + max_min * 60
    vuelta = 0

    while True:
        vuelta += 1
        generando = revisar_y_descargar(estado)

        faltan = [i for i in plan()
                  if estado.get(i["clave"], {}).get("estado", "nuevo") in ("nuevo", "fallo")]
        hechos = sum(1 for i in estado.values() if i.get("estado") == "descargado")

        print(f"[{time.strftime('%H:%M:%S')}] vuelta {vuelta}: {hechos}/{len(plan())} "
              f"descargados | {generando} generando | {len(faltan)} por lanzar", flush=True)

        if not faltan and generando == 0:
            return estado
        if time.monotonic() > limite:
            print("tiempo agotado; relanza --ciclo para continuar", file=sys.stderr)
            return estado

        if faltan:
            estado, lanzados = lanzar(estado, limite_n=0)
            if lanzados == 0:
                print("  sin hueco de cuota; espero", flush=True)

        time.sleep(60)


def escribir_manifiesto(estado):
    entradas = []
    for clave, item in sorted(estado.items()):
        if item.get("estado") != "descargado":
            continue
        entradas.append({
            "id": clave,
            "tipo": item["tipo"],
            "tema": item["tema"],
            "estilo": item.get("estilo", ""),
            "orientacion": item.get("orientacion"),
            "src": "/galeria/" + item["archivo"].split("frontend/public/galeria/")[-1],
            "bytes": item.get("bytes", 0),
        })

    cuerpo = json.dumps(entradas, indent=2, ensure_ascii=False)
    MANIFIESTO.write_text(
        "// Generado por scripts/gen_galeria.py. No editar a mano.\n"
        "// Artefactos creados con NotebookLM a partir de fuentes públicas\n"
        "// sobre bosques y áreas protegidas de Chile.\n"
        f"export const GALERIA = {cuerpo}\n",
        encoding="utf-8",
    )
    print(f"manifiesto: {len(entradas)} entradas -> {MANIFIESTO.relative_to(ROOT)}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--plan", action="store_true")
    ap.add_argument("--lanzar", action="store_true")
    ap.add_argument("--ciclo", action="store_true",
                    help="alterna descargar y lanzar hasta completar el plan")
    ap.add_argument("--adoptar", action="store_true",
                    help="registra artefactos del notebook que no estén en el plan")
    ap.add_argument("--manifiesto", action="store_true")
    ap.add_argument("--limite", type=int, default=0, help="cuántos lanzar como máximo")
    ap.add_argument("--max-min", type=int, default=45)
    args = ap.parse_args()

    if args.plan:
        for item in plan():
            print(f"{item['clave']:<10} {item['tipo']:<12} {item['estilo']:<14} {item['tema']}")
        return 0

    estado = cargar_estado()
    if args.adoptar:
        estado = adoptar(estado)
    if args.lanzar:
        estado, n = lanzar(estado, args.limite)
        print(f"lanzados {n}")
    if args.ciclo:
        estado = ciclo(estado, args.max_min)
    if args.ciclo or args.manifiesto:
        escribir_manifiesto(estado)

    hechos = sum(1 for i in estado.values() if i.get("estado") == "descargado")
    print(f"total descargados: {hechos}/{len(plan())}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
