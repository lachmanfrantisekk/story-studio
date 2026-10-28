#!/usr/bin/env python3
"""Original procedural ambient soundtrack + footfalls + phone signals + Piper voice.

No downloaded music, copyrighted samples or paid services. Standard-library only.
"""
from __future__ import annotations
import argparse
import array
import json
import math
import random
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FPS = 22050
SCENE_SECONDS = 12.5
RNG = random.Random(732118)


def read_wav(path: Path) -> array.array:
    with wave.open(str(path), "rb") as w:
        if (w.getframerate(), w.getnchannels(), w.getsampwidth()) != (FPS, 1, 2):
            raise RuntimeError(f"Špatný formát WAV: {path} (očekáván 22050Hz mono PCM16)")
        data = array.array('h')
        data.frombytes(w.readframes(w.getnframes()))
        if sys.byteorder != 'little':
            data.byteswap()
        return data


def generate(show_without_voice=False, dest=None):
    story = json.loads((ROOT / "storyboard.json").read_text(encoding="utf8"))
    scenes = story["scenes"]
    if len(scenes) != 6 or story["secondsPerScene"] != SCENE_SECONDS:
        raise RuntimeError("Tento pilot vyžaduje přesně šest 12,5sekundových scén.")
    N = round(len(scenes) * SCENE_SECONDS * FPS)
    # Synthesis is deterministic and independent of third-party audio licensing.
    bed = array.array('h', [0]) * N
    wind = 0.0
    for n in range(N):
        t = n / FPS
        scene = min(5, int(t // SCENE_SECONDS))
        local = t - scene * SCENE_SECONDS
        # Slowly-changing dark atmosphere, not an existing music composition.
        wind = 0.997 * wind + 0.003 * RNG.uniform(-1, 1)
        atmospheric = (0.18 * math.sin(2 * math.pi * 55 * t + .22 * math.sin(t * .23))
                       + 0.09 * math.sin(2 * math.pi * 82.41 * t)
                       + .12 * wind)
        if scene >= 3:
            atmospheric += .08 * math.sin(2 * math.pi * 44 * t)
        # Footsteps: short low thuds at rhythmic but action-dependent tempo.
        if scene in (0, 3, 4):
            pace = .66 if scene == 0 else .32
            phase = local % pace
            thump = .22 * math.exp(-phase * 30) * math.sin(2 * math.pi * 67 * phase)
            atmospheric += thump
        # Original two-tone messages (not a borrowed notification jingle).
        for cue in (SCENE_SECONDS + 2.5, SCENE_SECONDS * 2 + 1, SCENE_SECONDS * 4 + 1.4):
            delta = t - cue
            if 0 <= delta < .68:
                atmospheric += .13 * math.exp(-delta * 5) * math.sin(2 * math.pi * 522 * delta)
                atmospheric += .08 * math.exp(-delta * 7) * math.sin(2 * math.pi * 740 * delta)
        # Closing scene fades to silence; fade at beginning too.
        envelope = min(1, t / 1.3, max(0, (75 - t) / 3))
        if scene == 5 and local > 9:
            envelope *= max(0, (SCENE_SECONDS - local) / 3.5)
        bed[n] = int(max(-1, min(1, atmospheric * envelope * .48)) * 32767)
    if not show_without_voice:
        # 1.5 second lead-in per scene; voice mixed over an attenuated bed.
        for idx in range(len(scenes)):
            voice = read_wav(ROOT / ".voice" / f"voice-{idx:02}.wav")
            start = round((idx * SCENE_SECONDS + 1.5) * FPS)
            end = start + len(voice)
            if end > round((idx + 1) * SCENE_SECONDS * FPS):
                raise RuntimeError(f"Dabing překročil délku scény {idx+1}.")
            fade_len = max(1, int(FPS * .08))
            for j, sample in enumerate(voice):
                fade = min(1., j / fade_len, (len(voice) - j) / fade_len)
                # Speech ducking - bed reduces by 65 % under speech.
                value = .35 * bed[start + j] + sample * .85 * fade
                bed[start + j] = int(max(-32767, min(32767, value)))
    out = dest or ROOT / 'out' / 'soundtrack.wav'
    out.parent.mkdir(parents=True, exist_ok=True)
    if sys.byteorder != 'little':
        bed.byteswap()
    with wave.open(str(out), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(FPS)
        w.writeframes(bed.tobytes())
    print(f"Zvuková stopa: {out}; {N / FPS:.2f} s; hlas={'ne' if show_without_voice else 'ano'}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--test-no-voice', action='store_true', help='Offline test own SFX only (not production)')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    generate(show_without_voice=args.test_no_voice, dest=args.output)
