#!/bin/sh
# Build the full film: effects + mix + frames for every sequence (all following shots/edits.json), then join.
#   OUT=OV-Gateway-full-v7.mp4 sh tools/build-film.sh
set -eu
cd "$(dirname "$0")/.."
OUT=${OUT:-OV-Gateway-full-v7.mp4}
ENC="-c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart"
SEQS="seq01-02 seq03-05 shot06 seq07-09"

python3 tools/make_captions.py > /dev/null     # captions follow the narration placement in audio/mix.py
cd audio
python3 sfx_seq0102.py sfx_seq0102.wav
python3 sfx_seq0305.py sfx_seq0305.wav
python3 sfx_shot06.py sfx_shot06.wav
python3 sfx_seq0709.py sfx_seq0709.wav
for s in $SEQS; do python3 mix.py $s; done
cd ..

for s in $SEQS; do
  rm -rf renders/$s/frames
  node render-shot.mjs $s frames | tail -1
  ffmpeg -v error -y -framerate 30 -i renders/$s/frames/%04d.jpg -i audio/${s}_mix.wav $ENC -shortest renders/$s/$s-edit.mp4
done

cd renders
ffmpeg -v error -y -i seq01-02/seq01-02-edit.mp4 -i seq03-05/seq03-05-edit.mp4 -i shot06/shot06-edit.mp4 -i seq07-09/seq07-09-edit.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a][3:v][3:a]concat=n=4:v=1:a=1[v][a]" -map "[v]" -map "[a]" $ENC "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
ffmpeg -hide_banner -i "$OUT" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
echo BUILD-FILM-DONE
