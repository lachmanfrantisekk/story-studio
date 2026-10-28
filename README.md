# MIMO SIGNÁL — A6: nová grafická vrstva (navazuje na A5)

**Pilot „Poslední signál“** — 75 s, 1080 × 1920, 30 FPS. Režie a 24 záběrů z A5 zůstávají, přidává se originální kreslený 2.5D svět a propracovanější animovaná postava. Zvuk zůstává v režimech `manual` a `ai`.

## Nasazení (GitHub Desktop)

1. Rozbal ZIP a zkopíruj všechny soubory a složky **z jeho kořene** do kořene svého repozitáře `story-studio`. Potvrď přepsání.
2. V GitHub Desktop zkontroluj změny, klikni `Commit to main` a `Push origin`.
3. Na GitHubu otevři `Actions` → `MIMO SIGNÁL | Render pilot` → `Run workflow`.
4. Ponech `main`; pro vlastní hlas v CapCutu vyber `manual`, pro Piper `ai`.
5. Po úspěšném doběhnutí stáhni ZIP z `Artifacts` (název `mimo-signal-part01-manual` nebo `mimo-signal-part01-ai`).
6. Ve výsledku najdeš `pilot.mp4`, `cover.jpg`, `cover.png`, `popisek.txt`, `scenar-pro-dabing.txt` a `dabing-casovani.srt`.
7. Posuď obraz a plynulost pohybu na telefonu, ne jen ze zmenšeného náhledu. Případné chyby pošli jako screenshot z červeného kroku GitHub Actions.

## Co je nové

- `src/visuals.jsx`: originální vícevrstvý les, světlo, mlha, vzdálená hláska, detaily vegetace, kreslená postava Adam s animačním rigem.
- `public/grain.png`: slabé filmové zrno (vygenerované lokálně).
- `src/index.jsx`: nové prostředí a postava vložené do všech 24 záběrů, aktualizovaný cover.
- `VIZUALNI-REVIZE-A6.md`: popis grafických změn a jejich limitů.

## Ověření

Proběhla lokální kontrola JSX přes TypeScript parser/transpiler, kontrola konfigurace a vytvoření 12 statických snímků z vykreslených komponent v Chromium bez runtime chyb. **Plný Remotion render ani nový MP4 jsme zde zatím nespustili** (instalace závislostí v tomto prostředí nedoběhla). Cloudový render po nahrání je nezbytný finální test. Notebook uživatele nic nerenderuje.

## Bezpečnost

Bez placených API, bez API klíčů. Nepřidávej do veřejného repozitáře tajné klíče nebo soukromé příběhy. U veřejných GitHub Actions počítej s viditelnými logy a artifacts. Uchovávání artifacts je v workflow nastaveno na 1 den.
