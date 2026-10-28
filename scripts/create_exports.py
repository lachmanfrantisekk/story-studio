#!/usr/bin/env python3
"""Create social caption, human-readable voice-over script, and importable SRT."""
from pathlib import Path
import argparse
import json

root = Path(__file__).resolve().parents[1]
story = json.loads((root / 'storyboard.json').read_text(encoding='utf-8'))
out = root / 'out'
out.mkdir(exist_ok=True)

parser = argparse.ArgumentParser()
parser.add_argument('--voice-mode', choices=['manual', 'ai'], default='manual')
args = parser.parse_args()

(out / 'popisek.txt').write_text(
    'POSLEDNÍ SIGNÁL 🌲📱\n\n'
    'Když ti ve dvě ráno přijde zpráva z vlastního čísla… otočíš se?\n\n'
    'Co bys udělal/a ty? Napiš do komentářů.\n\n'
    '#CeskePribehy #Zahady #Horor #Mystery #AnimovanyPribeh #Shorts #Reels\n\n'
    'Obsah: originální fikce · Story Studio\n',
    encoding='utf-8'
)

def stamp(seconds):
    ms = round(seconds * 1000)
    hh, rem = divmod(ms, 3600000)
    mm, rem = divmod(rem, 60000)
    ss, milli = divmod(rem, 1000)
    return f'{hh:02}:{mm:02}:{ss:02},{milli:03}'

narration = []
srt = []
scene_seconds = float(story['secondsPerScene'])
for i, scene in enumerate(story['scenes']):
    start = i * scene_seconds
    end = start + scene_seconds
    # Same 1.5s lead-in as the AI voice mixer. Leave a safety gap for narration.
    voice_start = start + 1.5
    voice_end = end - 0.25
    narration.append(
        f'{i+1}. SCÉNA — {scene["title"]}\n'
        f'Čas scény: {stamp(start)} – {stamp(end)}\n'
        f'Doporučený začátek hlasu: {stamp(voice_start)}\n'
        f'Mluv nejpozději do: {stamp(voice_end)}\n'
        f'Text vypravěče: {scene["narration"]}\n'
        f'Titulek ve videu: {scene["caption"]}\n'
    )
    # SRT is a timing guide for voice-over narration, not for burnt-in captions.
    srt.append(f'{i+1}\n{stamp(voice_start)} --> {stamp(voice_end)}\n{scene["narration"]}\n')

header = (
    f'STORY STUDIO — SCÉNÁŘ K VLASTNÍMU DABINGU\n'
    f'{story["project"]}\n'
    f'Délka: {len(story["scenes"]) * scene_seconds:g} sekund | Jazyk: čeština\n'
    f'Režim exportu: {"vlastní dabing / CapCut" if args.voice_mode == "manual" else "AI hlas Piper"}\n\n'
    'NÁVOD: Otevři pilot.mp4 v CapCutu, vlož vlastní voice-over podle časů níže.\n'
    'Video obsahuje ambient a efekty. V režimu manual NEMÁ AI vypravěče.\n'
    'Soubor dabing-casovani.srt lze případně importovat jako časovou pomůcku.\n'
    'Dynamické titulky jsou už součástí obrazu; SRT obsahuje text vypravěče.\n'
    'Časová okna jsou orientační — před finálním exportem zkontroluj návaznost.\n\n'
)
(out / 'scenar-pro-dabing.txt').write_text(header + '\n'.join(narration), encoding='utf-8')
(out / 'dabing-casovani.srt').write_text('\n'.join(srt) + '\n', encoding='utf-8')
print('Exporty: popisek.txt, scenar-pro-dabing.txt, dabing-casovani.srt')
