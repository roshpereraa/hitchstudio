#!/usr/bin/env bash
# Hero film: 1080p cut from Mixkit 1080p originals (download https://assets.mixkit.co/videos/<id>/<id>-1080.mp4 into <raw-dir>).
# Usage: scripts/encode-hero.sh <raw-dir> public/video 1920 1080 23 hero
#        scripts/encode-hero.sh <raw-dir> public/video 1080 1920 25 hero-mobile
# Beats: builder on the phone, dentist, website on a tablet, screen in glasses (AI), dashboard, phone ringing.
set -euo pipefail
RAW=$1; OUT=$2; W=$3; H=$4; CRF=$5; NAME=$6
GRADE="hue=s=0,curves=all='0/0.02 0.3/0.26 0.7/0.74 1/0.97',eq=contrast=1.04,unsharp=5:5:0.4,noise=alls=2:allf=t"
LEN=2.9; FADE=0.5
specs=(1442:1.5 12139:3 41204:1.5 221:5 42664:2 247:12)
inputs=(); fc=""; n=0
for s in "${specs[@]}"; do id=${s%%:*}; ss=${s##*:}
  inputs+=(-ss $ss -t $LEN -i $RAW/$id.mp4)
  fc+="[$n:v]scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},fps=25,setsar=1,${GRADE}[v$n];"; n=$((n+1)); done
last=v0
for ((k=1;k<n;k++)); do off=$(python3 -c "print(round($LEN*$k-$FADE*$k,2))"); fc+="[$last][v$k]xfade=transition=fade:duration=$FADE:offset=$off[x$k];"; last=x$k; done
ffmpeg -v error -y "${inputs[@]}" -filter_complex "${fc%;}" -map "[$last]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf $CRF -preset slow -tune film -movflags +faststart $OUT/$NAME.mp4
ffmpeg -v error -y -i $OUT/$NAME.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 $OUT/$NAME.webm
ffmpeg -v error -y -ss 0.6 -i $OUT/$NAME.mp4 -frames:v 1 -c:v libwebp -quality 82 $OUT/$NAME.webp
ls -la $OUT/$NAME.*
