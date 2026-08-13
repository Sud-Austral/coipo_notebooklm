"""Prepara la galería para publicarla y escribe el manifiesto que lee la app.

Las infografías salen de NotebookLM como PNG de ~5 MB (2752x1536 y similares).
Treinta de esas son 150 MB, y como `frontend/public/` se copia entero a `dist/`,
publicarlas tal cual reventaría el sitio. Aquí se convierten a WebP —una versión
de 1600 px para el visor y una miniatura de 640 px para la rejilla— y el PNG
original se aparta a media/galeria/, que git ignora.

    python scripts/optimizar_galeria.py
"""

import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLICO = ROOT / "frontend" / "public" / "galeria"
ORIGINALES = ROOT / "media" / "galeria"
ESTADO = ROOT / "galeria-estado.json"
MANIFIESTO = ROOT / "frontend" / "src" / "data" / "galeria.js"

ANCHO_FULL = 1600
ANCHO_THUMB = 640


def ffmpeg(*args):
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", *args],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ffmpeg fallo: {r.stderr.strip()[-200:]}", file=sys.stderr)
    return r.returncode == 0


def a_webp(origen: Path, destino: Path, ancho: int, calidad: int) -> bool:
    if destino.exists() and destino.stat().st_size > 0:
        return True
    destino.parent.mkdir(parents=True, exist_ok=True)
    # -1 en la altura mantiene la proporcion; lanczos evita el aliasing del
    # texto, que en una infografia es justo lo que hay que leer.
    return ffmpeg("-i", str(origen),
                  "-vf", f"scale={ancho}:-1:flags=lanczos",
                  "-c:v", "libwebp", "-quality", str(calidad),
                  "-compression_level", "6", str(destino))


def recodificar_video(origen: Path, destino: Path) -> bool:
    """20 MB por video es inpublicable. CRF 30 los deja en ~5 MB sin que se
    note: son ilustraciones casi estaticas, muy compresibles."""
    if destino.exists() and destino.stat().st_size > 0:
        return True
    destino.parent.mkdir(parents=True, exist_ok=True)
    return ffmpeg("-i", str(origen),
                  "-c:v", "libx264", "-crf", "30", "-preset", "slow",
                  "-pix_fmt", "yuv420p",
                  "-c:a", "aac", "-b:a", "64k", "-ac", "1",
                  "-movflags", "+faststart",  # empieza a reproducir sin bajarlo entero
                  str(destino))


def recodificar_audio(origen: Path, destino: Path) -> bool:
    """NotebookLM entrega AAC a 256 kbps estereo; para voz sobra con 96."""
    if destino.exists() and destino.stat().st_size > 0:
        return True
    destino.parent.mkdir(parents=True, exist_ok=True)
    return ffmpeg("-i", str(origen), "-c:a", "aac", "-b:a", "96k",
                  "-movflags", "+faststart", str(destino))


def apartar(archivo: Path, tipo: str) -> None:
    """Saca el original de public/: Vite copia esa carpeta entera a dist/."""
    destino = ORIGINALES / tipo / archivo.name
    if archivo.parent == destino.parent:
        return
    destino.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(archivo), str(destino))


def poster(video: Path, destino: Path) -> bool:
    if destino.exists() and destino.stat().st_size > 0:
        return True
    destino.parent.mkdir(parents=True, exist_ok=True)
    return ffmpeg("-ss", "2", "-i", str(video), "-frames:v", "1",
                  "-vf", f"scale={ANCHO_THUMB}:-1:flags=lanczos",
                  "-c:v", "libwebp", "-quality", "72", str(destino))


def kb(n):
    return f"{n / 1024:,.0f} KB"


def main() -> int:
    if not ESTADO.exists():
        print("no hay galeria-estado.json; corre antes gen_galeria.py", file=sys.stderr)
        return 1

    estado = json.loads(ESTADO.read_text(encoding="utf-8"))
    entradas = []
    ahorro_antes = ahorro_despues = 0

    for clave, item in sorted(estado.items()):
        if item.get("estado") != "descargado":
            continue

        archivo = ROOT / item["archivo"]
        if not archivo.exists():
            # Ya se aparto el original en una pasada anterior.
            archivo = ORIGINALES / item["tipo"] / archivo.name
            if not archivo.exists():
                print(f"  falta {clave}", file=sys.stderr)
                continue

        base = {
            "id": clave,
            "tipo": item["tipo"],
            "tema": item["tema"],
            "estilo": item.get("estilo", ""),
            "orientacion": item.get("orientacion"),
        }

        if item["tipo"] == "infographic":
            full = PUBLICO / "infographic" / f"{archivo.stem}.webp"
            thumb = PUBLICO / "infographic" / f"{archivo.stem}-thumb.webp"
            if not (a_webp(archivo, full, ANCHO_FULL, 82)
                    and a_webp(archivo, thumb, ANCHO_THUMB, 74)):
                continue

            ahorro_antes += archivo.stat().st_size
            ahorro_despues += full.stat().st_size + thumb.stat().st_size
            apartar(archivo, "infographic")

            entradas.append({**base,
                             "src": f"/galeria/infographic/{full.name}",
                             "thumb": f"/galeria/infographic/{thumb.name}",
                             "bytes": full.stat().st_size})

        elif item["tipo"] == "video":
            nombre = archivo.stem.removesuffix("-web")
            web = PUBLICO / "video" / f"{nombre}-web.mp4"
            cartel = PUBLICO / "video" / f"{nombre}-poster.webp"

            if not recodificar_video(archivo, web):
                continue
            poster(web, cartel)

            ahorro_antes += archivo.stat().st_size
            ahorro_despues += web.stat().st_size
            apartar(archivo, "video")

            entradas.append({**base,
                             "src": f"/galeria/video/{web.name}",
                             "poster": f"/galeria/video/{cartel.name}" if cartel.exists() else None,
                             "bytes": web.stat().st_size})

        else:  # audio
            nombre = archivo.stem.removesuffix("-web")
            web = PUBLICO / "audio" / f"{nombre}-web.m4a"
            if not recodificar_audio(archivo, web):
                continue

            ahorro_antes += archivo.stat().st_size
            ahorro_despues += web.stat().st_size
            apartar(archivo, "audio")

            entradas.append({**base,
                             "src": f"/galeria/audio/{web.name}",
                             "bytes": web.stat().st_size})

    cuerpo = json.dumps(entradas, indent=2, ensure_ascii=False)
    MANIFIESTO.write_text(
        "// Generado por scripts/optimizar_galeria.py. No editar a mano.\n"
        "// Artefactos creados con NotebookLM a partir de fuentes públicas\n"
        "// sobre bosques y áreas protegidas de Chile.\n"
        f"export const GALERIA = {cuerpo}\n",
        encoding="utf-8",
    )

    por_tipo = {}
    peso = 0
    for e in entradas:
        por_tipo[e["tipo"]] = por_tipo.get(e["tipo"], 0) + 1
        peso += e["bytes"]

    print(f"manifiesto: {len(entradas)} entradas -> {MANIFIESTO.relative_to(ROOT)}")
    for tipo, n in sorted(por_tipo.items()):
        print(f"  {tipo:<12} {n}")
    if ahorro_antes:
        print(f"originales -> web: {kb(ahorro_antes)} -> {kb(ahorro_despues)} "
              f"({ahorro_antes / max(ahorro_despues, 1):.0f}x menos)")

    publicado = sum(f.stat().st_size for f in PUBLICO.rglob("*") if f.is_file())
    print(f"peso real de frontend/public/galeria: {publicado / 1048576:,.1f} MB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
