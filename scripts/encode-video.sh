#!/usr/bin/env bash
# Grades and encodes stock footage into the site's video spec.
# Usage: scripts/encode-video.sh <raw-dir> <out-dir>
# Grade: black and white, deep blacks, light grain. Silent.
set -euo pipefail
RAW=$1; OUT=$2; mkdir -p "$OUT"
GRADE="hue=s=0,curves=all='0/0 0.25/0.16 0.6/0.6 1/0.94',eq=contrast=1.08,noise=alls=7:allf=t+u"

# seq <name> <w> <h> <crop> <segment-length> id:start ...
seq() {
  if [ -n "${ONLY:-}" ] && [ "$ONLY" != "$1" ]; then return; fi
  local name=$1 w=$2 h=$3 crop=$4 len=$5; shift 5
  local inputs=() fc="" n=0 fade=0.6
  for spec in "$@"; do
    local id=${spec%%:*} ss=${spec##*:}
    inputs+=(-ss "$ss" -t "$len" -i "$RAW/$id.mp4")
    fc+="[$n:v]${crop}scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},fps=25,setsar=1,${GRADE}[v$n];"
    n=$((n+1))
  done
  local last="v0" off=0
  for ((k=1;k<n;k++)); do
    off=$(python3 -c "print(round($len*$k - $fade*$k,2))")
    fc+="[$last][v$k]xfade=transition=fade:duration=$fade:offset=$off[x$k];"; last="x$k"
  done
  fc=${fc%;}
  ffmpeg -v error -y "${inputs[@]}" -filter_complex "$fc" -map "[$last]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf ${CRF:-27} -preset slow -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -i "$OUT/$name.mp4" -an -c:v libvpx-vp9 -b:v 0 -crf ${WCRF:-40} -row-mt 1 -deadline good -cpu-used 2 "$OUT/$name.webm"
  ffmpeg -v error -y -ss 0.4 -i "$OUT/$name.mp4" -frames:v 1 -c:v libwebp -quality 72 "$OUT/$name.webp"
  printf "%-22s mp4 %6s KB  webm %6s KB  poster %4s KB\n" $name $(( $(stat -c%s "$OUT/$name.mp4")/1024 )) $(( $(stat -c%s "$OUT/$name.webm")/1024 )) $(( $(stat -c%s "$OUT/$name.webp")/1024 ))
}

# Hero: 16:9 desktop and 9:16 mobile cut, four slow beats.
CRF=26 seq hero        1280 720 "" 3.1 1445:2 4766:3 12878:1.5 247:4
CRF=27 seq hero-mobile 540 960 "" 3.1 1445:2 4766:3 12878:1.5 247:4
# Sector loops.
seq trades   1280 720 "" 3 778:12 44858:1 49023:3 20874:1
seq clinics  1280 720 "" 3 12148:3 28149:4 13039:3 48385:5
seq property 1280 720 "" 3 48394:4 15064:6 36159:1 24945:5
# Section clips, 4-6s, smaller.
CRF=29 seq card-trades   960 1200 "" 5 778:20
CRF=29 seq card-clinics  960 1200 "" 5 12139:2
CRF=29 seq card-property 960 1200 "" 5 24945:8
CRF=29 seq case-flexia   1280 720 "" 5 44858:2
CRF=29 seq case-4s       1280 720 "" 5 49539:4
CRF=29 seq case-nexus    1280 720 "" 5 25991:3
CRF=29 seq quote         960 1200 "crop=iw*0.42:ih:iw*0.5:0," 6 778:1
CRF=29 seq work-phone    1280 720 "" 5 4919:3
