#!/usr/bin/env python3
"""Make a Czech posting caption. Cover is extracted by FFmpeg in the workflow."""
from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
story = json.loads((root / 'storyboard.json').read_text(encoding='utf-8'))
out = root / 'out'
out.mkdir(exist_ok=True)
(out / 'popisek.txt').write_text(
    "POSLEDNÍ SIGNÁL 🌲📱\n\n"
    "Když ti ve dvě ráno přijde zpráva z vlastního čísla… otočíš se?\n\n"
    "Co bys udělal/a ty? Napiš do komentářů.\n\n"
    "#CeskePribehy #Zahady #Horor #Mystery #AnimovanyPribeh #Shorts #Reels\n\n"
    "Obsah: originální fikce · Story Studio\n",
    encoding='utf8',
)
print('Popisek uložen: out/popisek.txt')
