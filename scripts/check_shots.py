"""Simple static sanity checks for A5 script structure (not a render test)."""
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'src/index.jsx'
s=p.read_text(encoding='utf8')
assert s.count("{d:")==24, f"Expected 24 shots, got {s.count('{d:')}"
assert s.count('type:')>=24
assert 'durationInFrames={TOTAL}' in s
assert "registerRoot(Root)" in s
print('OK: static source contains 24 directed shots and compositions (render untested).')
