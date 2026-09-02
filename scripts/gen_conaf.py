"""Genera y descarga las 3 infografias de CONAF en image/.

Es el subconjunto CONAF del plan de gen_galeria.py (info-07 portrait ya salio;
info-17 square e info-27 landscape cayeron por cuota). Reanudable: salta lo que
ya esta en image/ y guarda el estado en image/estado.json.

Requiere sesion viva:
    .\\.venv\\Scripts\\nlm.exe login --check

Uso:
    .\\.venv\\Scripts\\python.exe scripts\\gen_conaf.py --plan
    .\\.venv\\Scripts\\python.exe scripts\\gen_conaf.py --ciclo
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
FOCO = "CONAF y la gestion del patrimonio silvestre"
DEST = ROOT / "image"
ESTADO = DEST / "estado.json"

# Mismo estilo "clay" en las tres; cambia orientacion y densidad para que no
# salgan clonadas. Coincide con info-07 / info-17 / info-27 de galeria-estado.json.
PLAN = [
    {"clave": "conaf-01", "orientacion": "portrait", "detalle": "concise"},
    {"clave": "conaf-02", "orientacion": "square", "detalle": "concise"},
    {"clave": "conaf-03", "orientacion": "landscape", "detalle": "standard"},
]

PAUSA = 6.0


def nlm(*args):
    return subprocess.run(
        [str(NLM), *args], capture_output=True, text=True, encoding="utf-8", errors="replace"
    )


def cargar_estado():
    if ESTADO.exists():
        return json.loads(ESTADO.read_text(encoding="utf-8"))
    return {}


def guardar_estado(estado):
    DEST.mkdir(parents=True, exist_ok=True)
    ESTADO.write_text(json.dumps(estado, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def args_de(item):
    return [
        "--style", "clay",
        "--orientation", item["orientacion"],
        "--detail", item["detalle"],
        "--focus", FOCO,
        "--language", "es",
    ]


def crear(item):
    """(True, artifact_id) o (False, 'rate_limit' | mensaje)."""
    r = nlm("infographic", "create", NOTEBOOK, *args_de(item), "-y", "--json")
    bruto = r.stdout.strip()

    inicio = bruto.find("{")
    data = {}
    if inicio >= 0:
        try:
            data = json.loads(bruto[inicio:])
        except json.JSONDecodeError:
            data = {}

    if data.get("artifact_id"):
        return True, data["artifact_id"]

    mensaje = f"{data.get('error', '')} {r.stderr}".strip() or bruto[-160:]
    if "RESOURCE_EXHAUSTED" in mensaje or "ate limit" in mensaje:
        return False, "rate_limit"
    return False, mensaje.replace("\n", " ")[-160:]


def descargar(item, artifact_id):
    salida = DEST / f"{item['clave']}-{item['orientacion']}.png"
    r = nlm("download", "infographic", NOTEBOOK, "--id", artifact_id, "-o", str(salida))
    if salida.exists() and salida.stat().st_size > 0:
        return True, salida
    return False, (r.stderr or r.stdout).replace("\n", " ")[-160:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", action="store_true", help="muestra que se generaria, sin llamar a la API")
    ap.add_argument("--ciclo", action="store_true", help="crea y descarga lo que falte")
    opts = ap.parse_args()

    if not opts.plan and not opts.ciclo:
        ap.error("elige --plan o --ciclo")

    estado = cargar_estado()

    if opts.plan:
        for item in PLAN:
            e = estado.get(item["clave"], {})
            print(f"  {item['clave']:<10} {item['orientacion']:<10} {item['detalle']:<9} -> {e.get('estado', 'pendiente')}")
        return 0

    if not NLM.exists():
        print(f"No encuentro {NLM}. Instala el venv primero.", file=sys.stderr)
        return 1

    chequeo = nlm("login", "--check")
    if "Authentication failed" in (chequeo.stdout + chequeo.stderr):
        print("Sesion de NotebookLM no valida. Corre:  .\\.venv\\Scripts\\nlm.exe login", file=sys.stderr)
        return 1

    DEST.mkdir(parents=True, exist_ok=True)

    for item in PLAN:
        clave = item["clave"]
        previo = estado.get(clave, {})
        if previo.get("estado") == "descargado":
            print(f"  {clave:<10} ya estaba; salto", flush=True)
            continue

        artifact_id = previo.get("artifact_id")
        if not artifact_id:
            ok, detalle = crear(item)
            if not ok:
                estado[clave] = {**item, "estado": "fallo", "error": detalle}
                guardar_estado(estado)
                if detalle == "rate_limit":
                    print(f"  {clave:<10} cuota agotada; corto la tanda", flush=True)
                    break
                print(f"  {clave:<10} FALLO al crear: {detalle}", file=sys.stderr)
                continue
            artifact_id = detalle
            estado[clave] = {**item, "estado": "creado", "artifact_id": artifact_id}
            guardar_estado(estado)
            print(f"  {clave:<10} creado {artifact_id}", flush=True)
            time.sleep(PAUSA)

        ok, detalle = descargar(item, artifact_id)
        if ok:
            estado[clave] = {**item, "estado": "descargado", "artifact_id": artifact_id,
                             "archivo": str(detalle.relative_to(ROOT)), "bytes": detalle.stat().st_size}
            print(f"  {clave:<10} descargado -> {detalle.name} ({detalle.stat().st_size:,} bytes)", flush=True)
        else:
            estado[clave] = {**item, "estado": "creado", "artifact_id": artifact_id, "error": detalle}
            print(f"  {clave:<10} aun renderizando; reintenta --ciclo mas tarde", flush=True)
        guardar_estado(estado)

    return 0


if __name__ == "__main__":
    sys.exit(main())
