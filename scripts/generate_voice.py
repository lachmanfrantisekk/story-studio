#!/usr/bin/env python3
"""Generate Czech narration with Piper, on GitHub Actions (not on the user's PC).

Intentionally fails if Piper is unavailable or a clip is too long: never
silently produce a faux 'voiced' video or hide a cost-bearing fallback.
"""
from __future__ import annotations
import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORY = json.loads((ROOT / "storyboard.json").read_text(encoding="utf-8"))
SCENES = STORY["scenes"]
VOICE = ROOT / ".voice"
VOICE.mkdir(exist_ok=True)
MODEL = ROOT / ".voice-model" / "cs_CZ-jirka-medium.onnx"


def call(args: list[str], **kwargs) -> None:
    subprocess.run(args, check=True, **kwargs)


def main():
    if not shutil.which("piper"):
        sys.exit("Piper není nainstalovaný. Dabing se nevytvořil; render se zastaví.")
    if not shutil.which("ffmpeg"):
        sys.exit("Chybí FFmpeg.")
    if not MODEL.is_file() or MODEL.stat().st_size < 30_000_000:
        sys.exit("Chybí platný model Piper jirka-medium. Zkontroluj download modelu.")
    for i, scene in enumerate(SCENES):
        raw = VOICE / f"voice-{i:02}.raw.wav"
        wav = VOICE / f"voice-{i:02}.wav"
        # No shell commands, text goes directly to Piper's standard input.
        call(["piper", "--model", str(MODEL), "--output_file", str(raw)],
             input=scene["narration"].strip() + "\n", text=True)
        call(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(raw),
              "-ar", "22050", "-ac", "1", "-c:a", "pcm_s16le", str(wav)])
        with wave.open(str(wav), "rb") as audio:
            seconds = audio.getnframes() / audio.getframerate()
            assert audio.getnchannels() == 1 and audio.getsampwidth() == 2
        # Sound starts 1.5 s into the 12.5-s scene.
        allowed = 10.75
        if i == len(SCENES) - 1:
            # Final 2.5 seconds belong to the part-2 teaser / end card.
            allowed = min(allowed, float(STORY["secondsPerScene"]) - 1.5 - float(STORY.get("endCardSeconds", 2.5)) - 0.1)
        if seconds > allowed:
            sys.exit(f"Scéna {i + 1}: dabing trvá {seconds:.1f} s. "
                     f"Zkrať narration (limit {allowed:.2f} s).")
        print(f"Scéna {i+1}: připraven český hlas, {seconds:.2f} s")
    print("Všechny hlasové stopy připraveny.")


if __name__ == "__main__":
    main()
