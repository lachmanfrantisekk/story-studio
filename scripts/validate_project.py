#!/usr/bin/env python3
"""Fast schema and consistency checks. No external dependencies."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
story = json.loads((root / 'storyboard.json').read_text(encoding='utf-8'))
brand = story['brand']
series = story['series']
for key in ('name', 'handle', 'tagline'):
    assert isinstance(brand.get(key), str) and brand[key].strip(), f'Missing brand.{key}'
for key in ('title', 'coverHook', 'endHook', 'endPrompt'):
    assert isinstance(series.get(key), str) and series[key].strip(), f'Missing series.{key}'
assert series['part'] >= 1 and isinstance(series['part'], int)
if series.get('nextPartPlanned'):
    assert isinstance(series.get('nextPart'), int) and series['nextPart'] > series['part']
assert story['fps'] == 30
assert (story['width'], story['height']) == (1080, 1920)
assert len(story['scenes']) == 6
assert abs(story['secondsPerScene'] * len(story['scenes']) - 75) < 0.001
assert 2 <= story['endCardSeconds'] <= 3
for i, scene in enumerate(story['scenes'], 1):
    assert all(isinstance(scene.get(key), str) and scene[key].strip() for key in ('title', 'caption', 'narration', 'action')), f'Incomplete scene {i}'
assert (root/'assets/mimo-signal-logo.svg').exists()
assert (root/'assets/mimo-signal-wordmark.svg').exists()
print('OK: MIMO SIGNÁL story metadata, 75s video, covers, part continuity, assets.')
