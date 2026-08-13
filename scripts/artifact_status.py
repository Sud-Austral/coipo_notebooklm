"""Estado de artefactos de un notebook.

Reemplaza a `nlm status artifacts`, que en la version 0.9.10 crashea con
`TypeError: '<=' not supported between instances of 'int' and 'OptionInfo'`
porque el default de `limit` de Typer se filtra hasta la capa de servicio.

Uso:
    python scripts/artifact_status.py <notebook_id> [--watch]
"""

import argparse
import dataclasses
import json
import sys
import time

from notebooklm_tools.cli.commands.studio import get_client
from notebooklm_tools.services import studio


def snapshot(notebook_id: str, profile: str | None = None) -> dict:
    with get_client(profile) as client:
        result = studio.get_studio_status(client, notebook_id, limit=20)
    if dataclasses.is_dataclass(result):
        return dataclasses.asdict(result)
    return result if isinstance(result, dict) else {"raw": repr(result)}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("notebook_id")
    ap.add_argument("--profile", default=None)
    ap.add_argument("--watch", action="store_true",
                    help="Reintenta hasta que el artefacto tenga URL descargable")
    ap.add_argument("--artifact-id", default=None,
                    help="Espera solo por este artefacto")
    ap.add_argument("--interval", type=int, default=30)
    ap.add_argument("--max-wait", type=int, default=1200)
    args = ap.parse_args()

    URL_KEYS = ("audio_url", "video_url", "infographic_url", "slide_deck_url")
    deadline = time.monotonic() + args.max_wait

    while True:
        data = snapshot(args.notebook_id, args.profile)
        arts = data.get("artifacts", [])
        if args.artifact_id:
            arts = [a for a in arts if a.get("artifact_id") == args.artifact_id]

        ready = [a for a in arts if any(a.get(k) for k in URL_KEYS)]
        failed = [a for a in arts if a.get("error_reason")]

        if not args.watch:
            print(json.dumps(data, indent=2, ensure_ascii=False, default=str))
            return 0

        elapsed = int(args.max_wait - (deadline - time.monotonic()))
        print(f"[{elapsed:>4}s] artefactos={len(arts)} listos={len(ready)} "
              f"fallidos={len(failed)} status={[a.get('status') for a in arts]}",
              file=sys.stderr, flush=True)

        if ready or failed:
            print(json.dumps({"artifacts": arts}, indent=2, ensure_ascii=False, default=str))
            return 1 if failed and not ready else 0
        if time.monotonic() > deadline:
            print("timeout esperando el artefacto", file=sys.stderr)
            print(json.dumps({"artifacts": arts}, indent=2, ensure_ascii=False, default=str))
            return 2
        time.sleep(args.interval)


if __name__ == "__main__":
    raise SystemExit(main())
