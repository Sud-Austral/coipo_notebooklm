"""Genera docs/CONEXION-PRIVADA.md con las credenciales reales de NotebookLM.

El documento incluye VALORES LITERALES de cookies de sesion de una cuenta Google.
Se genera aparte del repo versionado y se comprueba que git lo ignore antes de
escribirlo.

Por que un script y no un documento escrito a mano:
  - Las cookies rotan solas durante el uso normal del cliente, asi que cualquier
    copia manual queda obsoleta. Este script se vuelve a correr y listo.
  - Los valores se leen del disco y se escriben al disco sin pasar por ningun
    otro sitio.

Uso:
    python scripts/gen_private_doc.py
    python scripts/gen_private_doc.py --profile otro --output docs/OTRO-PRIVADA.md
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

from notebooklm_tools.core.auth import REQUIRED_COOKIES
from notebooklm_tools.mcp.tools._utils import ESSENTIAL_COOKIES
from notebooklm_tools.utils.browser import cookies_to_header, flatten_cookies
from notebooklm_tools.utils.config import get_profile_dir, get_storage_dir

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT = ROOT / "docs" / "CONEXION-PRIVADA.md"


def git_ignores(path: Path) -> bool:
    """True si git ignora la ruta. Un fallo del comando cuenta como 'no ignora'."""
    try:
        rel = path.resolve().relative_to(ROOT)
    except ValueError:
        return True  # fuera del repo: git no la puede versionar
    return subprocess.run(
        ["git", "check-ignore", "-q", str(rel).replace("\\", "/")],
        cwd=ROOT, capture_output=True,
    ).returncode == 0


def load_profile(profile: str) -> tuple[Path, dict, dict]:
    profile_dir = get_profile_dir(profile)
    cookies_path = profile_dir / "cookies.json"
    metadata_path = profile_dir / "metadata.json"

    if not cookies_path.is_file():
        raise SystemExit(
            f"No hay credenciales en {profile_dir}\n"
            f"Corre primero:  nlm login --profile {profile}"
        )

    raw_cookies = json.loads(cookies_path.read_text(encoding="utf-8"))
    metadata = (
        json.loads(metadata_path.read_text(encoding="utf-8"))
        if metadata_path.is_file() else {}
    )
    return profile_dir, raw_cookies, metadata


def build_document(profile: str, profile_dir: Path, cookies: dict, metadata: dict,
                   total_raw: int) -> str:
    header = cookies_to_header(cookies)
    email = metadata.get("email") or "(no detectada)"
    storage = get_storage_dir()

    env_lines = "\n".join(f"{name}={cookies[name]}" for name in ESSENTIAL_COOKIES
                          if name in cookies)
    faltantes = [n for n in ESSENTIAL_COOKIES if n not in cookies]

    tabla = "\n".join(
        f"| `{name}` | {'si' if name in cookies else '**FALTA**'} | "
        f"{len(cookies.get(name, ''))} | {'si' if name in REQUIRED_COOKIES else 'no'} |"
        for name in ESSENTIAL_COOKIES
    )

    aviso_faltantes = (
        f"\n> Faltan estas cookies esenciales: {', '.join(f'`{n}`' for n in faltantes)}. "
        f"Si alguna es de las requeridas, vuelve a correr `nlm login`.\n"
        if faltantes else ""
    )

    return f"""# Conexion NotebookLM — DOCUMENTO PRIVADO

> # ⛔ NO COMMITEAR · NO COMPARTIR · NO PEGAR EN TICKETS NI CHATS
>
> Este archivo contiene **cookies de sesion vivas** de una cuenta Google real.
> Quien las tenga entra a esa cuenta sin contrasena y sin segundo factor.
> Esta ignorado por `.gitignore` y por `.git/info/exclude`; no quites ninguna
> de las dos entradas.
>
> Generado por `scripts/gen_private_doc.py`. No lo edites a mano salvo el campo
> de contrasena: cualquier otro cambio se pierde al regenerar.

## 1. Cuenta

| Campo | Valor |
|---|---|
| Correo | `{email}` |
| Contrasena | `<<RELLENAR A MANO — mejor dejarla solo en el gestor de contrasenas>>` |
| Segundo factor | El que tenga la cuenta corporativa. No se puede exportar. |
| Perfil del cliente | `{profile}` |
| Ultima validacion | `{metadata.get('last_validated') or '(desconocida)'}` |

La herramienta **nunca ve la contrasena**: el login ocurre en una ventana de
Chrome y solo se capturan las cookies resultantes. Por eso el campo esta vacio.
Si la rellenas aqui, este archivo pasa a ser tan sensible como tu gestor de
contrasenas.

## 2. Donde viven las credenciales

| | |
|---|---|
| Directorio de estado | `{storage}` |
| Perfil | `{profile_dir}` |
| Archivos | `cookies.json` (volcado crudo del navegador), `metadata.json` (CSRF y sesion) |

`cookies.json` guarda **todas** las cookies del navegador, de todos los dominios
—no solo las de Google—. Este documento esta filtrado a las {len(ESSENTIAL_COOKIES)}
cookies que el cliente considera esenciales; de las {total_raw} que hay en el
volcado, el resto no hace falta para conectarse.

## 3. Cookies esenciales

| Cookie | Presente | Largo | Requerida |
|---|---|---|---|
{tabla}
{aviso_faltantes}
### Valores literales

```dotenv
{env_lines}
```

## 4. Tokens de sesion

| Campo | Valor |
|---|---|
| `csrf_token` (SNlM0e) | `{metadata.get('csrf_token') or '(se extrae solo en la primera llamada)'}` |
| `session_id` (FdrFJe) | `{metadata.get('session_id') or '(se extrae solo en la primera llamada)'}` |
| `build_label` (cfb2h) | `{metadata.get('build_label') or '(se extrae solo)'}` |
| `base_host` | `{metadata.get('base_host') or 'notebooklm.google.com'}` |

El CSRF y el session id **no hace falta copiarlos**: el cliente los vuelve a
extraer solo si faltan. De hecho `NOTEBOOKLM_CSRF_TOKEN` y `NOTEBOOKLM_SESSION_ID`
estan **deprecadas y ya no se leen**, precisamente porque un valor viejo bloqueaba
el auto-refresco.

El `base_host` es harina de otro costal: **es el dato que mas rompe conexiones**.
Esta cuenta esta en `{metadata.get('base_host') or 'notebook.google.com'}`, pero el
valor por defecto del paquete es `notebooklm.google.com`. Cualquier receta que no
lea `metadata.json` tiene que pasarlo a mano en `NOTEBOOKLM_BASE_URL`, o la
peticion rebota a `accounts.google.com` y el error dice *"Authentication expired"*
—que es enganoso, porque las cookies estan bien—.

---

# Como conectar OTRO proyecto

## Receta A — Compartir el directorio de credenciales (recomendada)

El otro proyecto apunta al mismo directorio de estado. No se copia nada, y cuando
las cookies roten, **los dos proyectos ven la rotacion**.

```powershell
# PowerShell
$env:NOTEBOOKLM_MCP_CLI_PATH = "{storage}"
nlm notebook list
```

```bash
# bash / zsh
export NOTEBOOKLM_MCP_CLI_PATH="{storage}"
nlm notebook list
```

En un `.mcp.json` de otro repo:

```json
{{
  "mcpServers": {{
    "notebooklm": {{
      "type": "stdio",
      "command": "C:\\\\ruta\\\\a\\\\ese-proyecto\\\\.venv\\\\Scripts\\\\notebooklm-mcp.exe",
      "env": {{
        "NOTEBOOKLM_MCP_CLI_PATH": "{str(storage).replace(chr(92), chr(92) * 4)}",
        "NOTEBOOKLM_HL": "es"
      }}
    }}
  }}
}}
```

Solo sirve en **esta maquina**: es una ruta local. A cambio no sufre ninguno de
los problemas de las otras recetas — lee `metadata.json`, asi que el `base_host`
y el CSRF salen correctos solos, y las rotaciones de cookies se comparten.

## Receta B — Cookies por variable de entorno

Para otra maquina, un contenedor o CI.

> **Las dos variables son obligatorias, no solo la de las cookies.**
> `NOTEBOOKLM_COOKIES` es un override *total*: descarta el perfil guardado
> entero, incluido el `base_host`. Sin `NOTEBOOKLM_BASE_URL` el cliente asume
> `notebooklm.google.com`, esta cuenta esta en `{metadata.get('base_host') or 'notebook.google.com'}`, la peticion
> rebota a `accounts.google.com` y falla con *"Authentication expired"* — aunque
> las cookies esten perfectas. Verificado empiricamente: con la variable, 24
> notebooks; sin ella, error.

```powershell
$env:NOTEBOOKLM_COOKIES = "{header}"
$env:NOTEBOOKLM_BASE_URL = "https://{metadata.get('base_host') or 'notebook.google.com'}"
nlm notebook list
```

```bash
export NOTEBOOKLM_COOKIES="{header}"
export NOTEBOOKLM_BASE_URL="https://{metadata.get('base_host') or 'notebook.google.com'}"
nlm notebook list
```

Caduca cuando roten las cookies. Regenera este documento y vuelve a copiarlas.

## Receta C — Importar un archivo de cookies (con un pero)

> **Probado y NO funciona con el `cookies.json` del perfil tal cual.**
> Pasarle el volcado crudo falla con
> `Error: Imported cookies were rejected by Gemini Notebook`, aunque esas mismas
> credenciales conectan perfectamente por la Receta B. El volcado trae {total_raw}
> nombres de cookie de varios dominios y el probe de verificacion los rechaza.

El parser acepta cuatro formatos (JSON plano `{{"SID": "..."}}`, lista de objetos
`{{name, value}}`, Netscape `cookies.txt` y header crudo), y antes de guardar
verifica contra el servidor. La variante que **deberia** funcionar es darle un
archivo ya filtrado a las esenciales:

```bash
# genera el archivo filtrado desde este documento y luego:
nlm login --manual --file cookies-filtradas.json --profile default
```

**Sin verificar**: no llegue a probar esta variante. Si necesitas mover la sesion
a otra maquina, usa la Receta B, que si esta comprobada de punta a punta.

## Elegir perfil

```bash
export NLM_PROFILE=otro     # o:  nlm login switch otro
```

---

# Caducidad

Las cookies **rotan solas** mientras usas el cliente: se reescriben `cookies.json`
y `metadata.json` en cada validacion. Los valores literales de este documento son
una foto del momento de generarlo.

| Sintoma | Que hacer |
|---|---|
| `nlm login --check` sale con codigo 2 | `nlm login` (reabre Chrome) |
| `Authentication expired. Run 'nlm login'...` | Igual |
| `Credentials have expired.` | Igual |

Despues de cualquier `nlm login`, **regenera este documento**:

```powershell
.\\.venv\\Scripts\\python.exe scripts\\gen_private_doc.py
```

Si prefieres no depender de valores literales, usa la Receta A: no caduca porque
lee siempre el archivo vivo.
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--profile", default=os.environ.get("NLM_PROFILE", "default"))
    ap.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    ap.add_argument("--allow-unignored", action="store_true",
                    help="Escribir aunque git NO ignore el destino (peligroso)")
    args = ap.parse_args()

    output = args.output if args.output.is_absolute() else (ROOT / args.output)

    if not git_ignores(output) and not args.allow_unignored:
        print(
            f"ABORTADO: git no ignora {output}\n"
            f"Este archivo lleva cookies de sesion en claro. Anade la ruta a\n"
            f".gitignore y a .git/info/exclude, o usa --allow-unignored si sabes\n"
            f"lo que haces.",
            file=sys.stderr,
        )
        return 1

    profile_dir, raw_cookies, metadata = load_profile(args.profile)

    flat = flatten_cookies(raw_cookies)
    cookies = {name: flat[name] for name in ESSENTIAL_COOKIES if name in flat}

    missing_required = sorted(set(REQUIRED_COOKIES) - set(cookies))
    if missing_required:
        print(f"AVISO: faltan cookies requeridas: {', '.join(missing_required)}. "
              f"Corre 'nlm login' antes de fiarte de este documento.", file=sys.stderr)

    doc = build_document(args.profile, profile_dir, cookies, metadata, len(flat))

    output.parent.mkdir(parents=True, exist_ok=True)
    fd = os.open(output, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as f:
        f.write(doc)

    # Nunca imprimir valores: solo el recuento.
    print(f"Escrito {output}")
    print(f"  perfil          : {args.profile} ({profile_dir})")
    print(f"  cookies totales : {len(flat)} en el volcado")
    print(f"  esenciales      : {len(cookies)}/{len(ESSENTIAL_COOKIES)} presentes")
    print(f"  requeridas      : {'OK' if not missing_required else 'FALTAN'}")
    print(f"  ignorado por git: {'si' if git_ignores(output) else 'NO'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
