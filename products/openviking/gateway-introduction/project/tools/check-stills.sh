#!/bin/sh
# Stage 1: check stills for the 07–09 fixes, the 06→07 cut, and the 03–05 request pills.
set -eu
cd "$(dirname "$0")/.."
node render-shot.mjs seq07-09 stills 0.0 21.5 23.5 25.0
node render-shot.mjs shot06 stills 25.99
node render-shot.mjs seq03-05 stills 30.2 30.8 32.3
python3 - <<'PY'
import subprocess, re
out = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'renders/seq07-09/stills/t0.00.png', '-i', 'renders/shot06/stills/t25.99.png',
                      '-lavfi', 'psnr', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('06 end vs 07 start PSNR', re.search(r'average:(\S+)', out).group(1))
PY
echo CHECK-STILLS-DONE
