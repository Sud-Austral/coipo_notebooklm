"""Ingesta de artefactos multimedia descargados desde NotebookLM.

Toma un archivo (audio/video generado en NotebookLM), lo deja bajo media/,
le extrae metadata real con ffprobe y actualiza media/manifest.json.

Uso:
    python scripts/ingest_media.py <archivo> [--notebook NOMBRE] [--artifact-id ID]
"""

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MEDIA_DIR = ROOT / "media"
MANIFEST = MEDIA_DIR / "manifest.json"


def ffprobe(path: Path) -> dict:
    """Metadata real del archivo. Devuelve {} si ffprobe no está disponible."""
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_format", "-show_streams",
             "-of", "json", str(path)],
            capture_output=True, text=True, check=True,
        ).stdout
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        print(f"  aviso: ffprobe no pudo leer el archivo ({e})", file=sys.stderr)
        return {}

    data = json.loads(out)
    fmt = data.get("format", {})
    streams = data.get("streams", [])
    audio = next((s for s in streams if s.get("codec_type") == "audio"), {})
    video = next((s for s in streams if s.get("codec_type") == "video"), {})

    meta = {
        "formato": fmt.get("format_long_name"),
        "duracion_s": round(float(fmt["duration"]), 2) if fmt.get("duration") else None,
        "bitrate_kbps": round(int(fmt["bit_rate"]) / 1000) if fmt.get("bit_rate") else None,
    }
    if audio:
        meta["audio"] = {
            "codec": audio.get("codec_name"),
            "sample_rate": audio.get("sample_rate"),
            "canales": audio.get("channels"),
        }
    if video:
        meta["video"] = {
            "codec": video.get("codec_name"),
            "resolucion": f"{video.get('width')}x{video.get('height')}",
        }
    return meta


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("archivo", type=Path, help="Archivo descargado desde NotebookLM")
    ap.add_argument("--notebook", default=None, help="Nombre del notebook de origen")
    ap.add_argument("--artifact-id", default=None, help="ID del artefacto en NotebookLM")
    ap.add_argument("--tipo", default=None, help="audio | video | otro (se infiere si se omite)")
    args = ap.parse_args()

    src = args.archivo.expanduser().resolve()
    if not src.is_file():
        print(f"error: no existe {src}", file=sys.stderr)
        return 1

    tipo = args.tipo or (
        "audio" if src.suffix.lower() in {".m4a", ".mp3", ".wav", ".ogg"}
        else "video" if src.suffix.lower() in {".mp4", ".webm", ".mov"}
        else "otro"
    )

    dest_dir = MEDIA_DIR / tipo
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / src.name

    if src != dest:
        shutil.copy2(src, dest)

    entry = {
        "archivo": str(dest.relative_to(ROOT)).replace("\\", "/"),
        "tipo": tipo,
        "bytes": dest.stat().st_size,
        "sha256": sha256(dest),
        "notebook": args.notebook,
        "artifact_id": args.artifact_id,
        "ingestado_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "metadata": ffprobe(dest),
    }

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else []
    manifest = [e for e in manifest if e["archivo"] != entry["archivo"]]
    manifest.append(entry)
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    print(json.dumps(entry, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
