# Story Studio — pilot A2: český hlas + původní zvuky

Pokračování úspěšně cloudově vyrenderovaného vizuálního prototypu „Poslední signál“.
Zachovává 6 animovaných scén, 1080×1920, 30 FPS, 75 sekund. Přidává český
hlas Piper (`cs_CZ-jirka-medium`) a původní procedurálně syntetizovaný ambient,
kroky a upozornění telefonu. Nepoužívá žádnou placenou službu ani žádné cizí
hudební nahrávky. Vše se generuje na GitHub Actions runneru, NE na notebooku.

## Nasazení na GitHub — bez terminálu

1. Otevři svůj veřejný repozitář `story-studio` a přepni na větev `main`.
2. Nahraj **obsah rozbaleného ZIPu** do kořene repozitáře. Přepiš existující
   `README.md`, `package.json`, `src/index.jsx` (pokud se změnil),
   `.github/workflows/render.yml`; přidej `storyboard.json`, `scripts/` a
   `.gitignore`. `.github` může být skrytá složka ve Windows (zapni skryté soubory).
3. Pokud GitHub web neumí nahrát do `.github/workflows/` nebo zachovat adresáře,
   použij GitHub Desktop: rozbal ZIP přímo do lokální složky repozitáře,
   **Commit to main** → **Push origin**.
4. Záložka **Actions** → **Render pilot** → **Run workflow** → zelené **Run workflow**.
5. Otevři poslední běh. Po zeleném dokončení v **Artifacts** stáhni
   `story-studio-pilot-a2-cz` a rozbal `pilot.mp4`, `cover.jpg` a `popisek.txt`.
6. Pusť video **se zvukem**. Ověř srozumitelnost českého hlasu a zvukové efekty.
   Pokud je běh červený, otevři červený krok a pošli chybovou hlášku.

## Co dělají soubory

- `storyboard.json` — texty pro titulky, dabing a šest scén na jednom místě.
- `src/index.jsx` — animační obraz (zachovaný osvědčený základ).
- `scripts/generate_voice.py` — spouští Piper pro šest českých vět.
- `scripts/mix_audio.py` — skládá hlas a autorské efekty do 75s WAV.
- `scripts/check_output.py` — ověřuje MP4 s videem a zvukem.
- `scripts/create_exports.py` — vytvoří český návrh popisku a hashtagů.
- FFmpeg vyexportuje `cover.jpg` ze skutečného videa.
- `.github/workflows/render.yml` — vše vykoná v GitHub Actions.

## Rozpočet a soukromí

Ve workflow nejsou klíče, API ani nákup kreditů. Výstupní MP4 a logy Actions
mohou být ve veřejném repozitáři veřejně dostupné. Výstup se uchovává 1 den.
Hlasový model se stahuje při každém spuštění; požaduje síťové připojení GitHub
runneru a Hugging Face. Počet běhů spouštěj ručně — běh se při chybě automaticky
neopakuje.

## Licence

Piper `cs_CZ-jirka-medium`: původní MODEL_CARD uvádí dataset CC0. Repozitář
rhasspy/piper-voices má vlastní licenci; řiď se i podmínkami použitého
softwaru. Zvukové efekty a atmosférická stopa jsou vytvořeny algoritmicky
ze zdrojového kódu tohoto projektu, bez stažených samplů.

## Testování

Původní pilot byl podle uživatelské kontroly z GitHub Actions funkční (7/7).
Tato aktualizace má nové kroky s dabingem a musí být ověřena **novým** během
GitHub Actions. Lokální testy scripts lze provést bez instalace Piper s volbou
`python scripts/mix_audio.py --test-no-voice`; to však nenahrazuje reálný TTS test.
Není hotová administrace (etapa B) ani AI generátor postav (etapa C).
