#!/usr/bin/env python3
"""Export branding-aware Czech publication copy, script, and SRT."""
from pathlib import Path
import argparse
import json

ROOT = Path(__file__).resolve().parents[1]
STORY = json.loads((ROOT / 'storyboard.json').read_text(encoding='utf-8'))
OUT = ROOT / 'out'
OUT.mkdir(parents=True, exist_ok=True)

parser = argparse.ArgumentParser()
parser.add_argument('--voice-mode', choices=['manual', 'ai'], default='manual')
args = parser.parse_args()

series = STORY['series']
brand = STORY['brand']
part = int(series['part'])
next_part = series.get('nextPart')
next_planned = bool(series.get('nextPartPlanned', False)) and isinstance(next_part, int)
headline = series['coverHook']

caption = (
    f'{brand["name"]} · {series["title"]} — PART {part:02d}\n\n'
    f'{headline}\n\n'
    'Co bys udělal/a na Adamově místě? 👀\n'
    + (f'Pokračování PART {next_part:02d} připravujeme. Sleduj {brand["handle"]}.\n\n'
       if next_planned else f'Jak si vysvětluješ ten konec? Napiš do komentářů. Sleduj {brand["handle"]}.\n\n')
    + '#MimoSignal #CeskePribehy #Zahady #Horor #Mystery #AnimovanePribehy #Shorts #Reels\n\n'
    + 'Originální fiktivní příběh.\n'
)
(OUT / 'popisek.txt').write_text(caption, encoding='utf-8')


def stamp(seconds):
    ms = round(seconds * 1000)
    hh, rem = divmod(ms, 3600000)
    mm, rem = divmod(rem, 60000)
    ss, milli = divmod(rem, 1000)
    return f'{hh:02}:{mm:02}:{ss:02},{milli:03}'


scene_seconds = float(STORY['secondsPerScene'])
full_length = len(STORY['scenes']) * scene_seconds
end_card = float(STORY.get('endCardSeconds', 2.5))
spoken_end = full_length - end_card
narration = []
srt = []
for i, scene in enumerate(STORY['scenes']):
    start = i * scene_seconds
    end = start + scene_seconds
    voice_start = start + 1.5
    voice_end = min(end - 0.25, spoken_end - 0.1)
    if voice_end <= voice_start:
        raise ValueError(f'V poslední scéně není dost času na hlas: {i+1}')
    narration.append(
        f'{i+1}. SCÉNA — {scene["title"]}\n'
        f'Čas: {stamp(start)} – {stamp(end)}\n'
        f'Doporučené okno hlasu: {stamp(voice_start)} – {stamp(voice_end)}\n'
        f'Text dabingu: {scene["narration"]}\n'
        f'Text titulku: {scene["caption"]}\n'
    )
    srt.append(f'{i+1}\n{stamp(voice_start)} --> {stamp(voice_end)}\n{scene["narration"]}\n')

header = (
    f'{brand["name"]} — SCÉNÁŘ PRO DABING\n'
    f'{series["title"]} / PART {part:02d} / {series["episodeCode"]}\n'
    f'Délka videa: {full_length:g} s; závěrečná obrazovka: posledních {end_card:g} s.\n'
    f'Režim: {"vlastní hlas v CapCutu" if args.voice_mode == "manual" else "AI hlas Piper"}.\n\n'
    'Postup: Otevři MP4 v CapCutu a nahraj vlastní hlas dle časů.\n'
    'Pozor: Titulky jsou přímo v obrazu. SRT je časová pomůcka pro dabing.\n'
    'Poslední hlasové okno končí před závěrečnou obrazovkou.\n\n'
)
footer = (
    f'\nZÁVĚREČNÁ OBRAZOVKA: {series["endHook"]}\n'
    + (f'PART {next_part:02d} — {series["endPrompt"]}\n' if next_planned else 'KONEC PŘÍBĚHU\n')
)
(OUT / 'scenar-pro-dabing.txt').write_text(header + '\n'.join(narration) + footer, encoding='utf-8')
(OUT / 'dabing-casovani.srt').write_text('\n'.join(srt) + '\n', encoding='utf-8')
print('Exporty MIMO SIGNÁL připraveny: popisek, scénář, SRT')
