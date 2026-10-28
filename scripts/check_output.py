#!/usr/bin/env python3
"""Verify the actual rendered deliverable, not merely an Actions green checkmark."""
import json
import subprocess
import sys
from pathlib import Path

file = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('out/pilot.mp4')
if not file.is_file() or file.stat().st_size < 100_000:
    sys.exit(f"Video nenalezeno nebo příliš malé: {file}")
probe = subprocess.run(['ffprobe','-v','error','-show_entries',
                        'format=duration:stream=codec_type,width,height,r_frame_rate,codec_name',
                        '-of','json',str(file)],capture_output=True,text=True,check=True)
info = json.loads(probe.stdout)
streams = info['streams']
videos = [s for s in streams if s['codec_type'] == 'video']
audios = [s for s in streams if s['codec_type'] == 'audio']
if len(videos) != 1 or not audios:
    sys.exit('Video musí mít 1 video stream a minimálně 1 audio stream.')
v = videos[0]
if (v.get('width'),v.get('height'),v.get('r_frame_rate')) != (1080,1920,'30/1'):
    sys.exit(f"Nesprávné parametry videa: {v}")
duration = float(info['format']['duration'])
if abs(duration - 75) > .35:
    sys.exit(f"Špatná délka {duration:.2f} s, očekáváno 75 s.")
if file.stat().st_size <= 200_000:
    sys.exit('Výsledný soubor je podezřele malý.')
check = subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(file),
                        '-vn','-af','volumedetect','-f','null','-'],
                        capture_output=True,text=True,check=True)
import re
match = re.search(r'mean_volume:\s*(-?(?:\d+(?:\.\d+)?|inf))\s*dB', check.stderr)
if not match or match.group(1) == '-inf' or float(match.group(1)) < -60:
    sys.exit('Zvukový stream je tichý nebo se nepodařilo ověřit jeho úroveň.')
print(f"OK: {file}, 1080×1920, 30 FPS, {duration:.2f} s, video+audio, hlasitost {match.group(1)} dB")
