#!/usr/bin/env bash
# Rehace los tres vídeos de punta a punta: locución, montaje y render.
# Se ejecuta desde video/pipeline. Cada paso corta si el anterior falló, para
# no rendear una hora sobre un audio que no se generó — ya pasó una vez.
set -euo pipefail
cd "$(dirname "$0")"
V=..

echo "=== 1. locuciones con el ritmo conversacional ==="
for g in "guion_catastro catastro" \
         "guion_contrato_pod contrato_pod" \
         "guion_ecosistema_pod ecosistema_pod"; do
  set -- $g
  python narrar_beats.py "$1" "$2" 2>&1 | tail -2
done

echo
echo "=== 2. comprobar que el audio dura lo que dice el JSON ==="
python - <<'PY'
import io, json, subprocess, sys
mal = 0
for n in ('catastro', 'contrato_pod', 'ecosistema_pod'):
    d = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration',
                              '-of','csv=p=0','../public/narracion_%s.mp3' % n],
                             capture_output=True, text=True).stdout)
    t = json.load(io.open('beats_%s.json' % n, encoding='utf-8'))['total']
    # ASIMETRICA a proposito. El fallo que importa —faltar el silencio de la
    # portadilla— deja el audio MAS CORTO que el JSON, y eso nunca se tolera.
    # Que sobre hasta segundo y medio es normal: es la cola de ruido de sala.
    ok = -0.05 <= (d - t) <= 1.5
    mal += 0 if ok else 1
    print('  %-16s audio %.1f s | JSON %.1f s | %s' % (n, d, t, 'ok' if ok else 'DESCUADRADO'))
sys.exit(1 if mal else 0)
PY

echo
echo "=== 3. llevar los latidos al proyecto ==="
cp beats_catastro.json beats_contrato_pod.json beats_ecosistema_pod.json "$V/src/"

echo
echo "=== 4. renders ==="
cd "$V"
for c in "Catastro pod-catastro" "ContratoPod pod-contrato" "EcosistemaPod pod-ecosistema"; do
  set -- $c
  echo "--- $1 ---"
  npx remotion render src/index.jsx "$1" "out/$2.mp4" --concurrency=6 2>&1 | tr '\r' '\n' | tail -2
done

echo
echo "=== 5. copias ligeras y entrega ==="
while IFS=: read -r origen destino; do
  cp "out/$origen.mp4" "$destino.mp4"
  ffmpeg -v error -y -i "out/$origen.mp4" -c:v libx264 -crf 26 -preset slow \
         -c:a aac -b:a 128k "$destino (liviano).mp4"
  echo "  $destino"
done <<'LISTA'
pod-catastro:Catastro de Usos de la Tierra — podcast
pod-contrato:Sistema de Gestión de Contratos — podcast
pod-ecosistema:El ecosistema COIPO — podcast
LISTA

echo
echo "=== TODO REHECHO ==="
