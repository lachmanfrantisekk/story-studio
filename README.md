# MIMO SIGNÁL — Etapa A4: identita, filmový cover a závěrečná obrazovka

**MIMO SIGNÁL** je veřejná značka originálních českých animovaných příběhů. Cílový handle: **@mimosignal** (dostupnost ověř před registrací). Claim: **Příběhy za hranicí reality.**

## Co je nového proti A3

- Nové SVG logo a wordmark ve složce `assets/`.
- Ve videu se zobrazuje MIMO SIGNÁL místo Story Studio.
- V posledních **2,5 s** (uvnitř původních 75 s) závěrečná obrazovka s otázkou a případným teaserem na další part.
- Skutečný cover z Remotion kompozice `Cover`: hook, filmová ilustrace, název série a `PART 01`. Není to obyčejný screenshot ze scény.
- `storyboard.json` obsahuje metainformace o značce, pokračování a coveru.
- Popisek, scénář pro vlastní dabing a SRT se tvoří ze storyboardu a používají jméno MIMO SIGNÁL.
- Dva dabingové režimy z A3 zůstávají: `manual` (vlastní hlas v CapCutu), `ai` (Piper).
- Žádné klíče, přihlášení ani placené služby se nedoplňují.

## Jak aktualizovat GitHub — bez terminálu

1. Rozbal soubor ZIP s A4.
2. Otevři GitHub Desktop a svůj lokální repozitář `story-studio` (nemusíš ho přejmenovat).
3. Klikni na **Repository → Show in Explorer**.
4. Zkopíruj **obsah** rozbalené složky A4 do kořene repozitáře. Potvrď přepsání souborů.
5. V GitHub Desktop napiš třeba `MIMO SIGNAL A4 - branding` a klikni **Commit to main** a potom **Push origin**.
6. Na GitHubu otevři **Actions → MIMO SIGNÁL | Render pilot → Run workflow**.
7. Vyber `manual` (pokud si chceš hlas nahrát sám) nebo `ai`, větev `main`, pak zelené **Run workflow**.
8. Po úspěšném dokončení otevři běh a stáhni **Artifacts → mimo-signal-part01-manual** (nebo `-ai`).
9. Rozbal ZIP. Najdeš `pilot.mp4`, `cover.jpg`, `cover.png`, `popisek.txt`, `scenar-pro-dabing.txt`, `dabing-casovani.srt`.
10. `pilot.mp4` můžeš vložit do CapCutu. `cover.jpg` použij jako náhled. Dabing namluv podle scénáře.

## Nastavení dalších příběhů

V `storyboard.json` lze upravit `series.title`, `series.coverHook`, `series.part`, `series.endHook`, `series.nextPart`, `series.endPrompt` a `series.nextPartPlanned`.

- `nextPartPlanned: true` → zobrazí číslo pokračování.
- `nextPartPlanned: false` → zobrazí samostatný konec. Nepředstírá pokračování.

Poznámka: současné postavy a prostředí jsou stále **původní SVG pilot**, nikoliv automaticky AI vytvořená grafika podle přiložených referencí. Nová grafická úroveň je další vývojová fáze. Zvuk, střih a skutečná animace zůstávají založené na původním prototypu.

## Omezení a stav testů

Základ A3 už byl funkčně prověřován. Úprava A4 zachovává parametry 75 s, 1080×1920, 30 FPS. Nový cover se generuje pomocí `npx remotion still`; konečný cloudový render musíš teprve ověřit v Actions. Zelená Actions ještě sama o sobě neurčuje uměleckou kvalitu výsledku.

Veřejný GitHub repozitář: logy a artifacts mohou být veřejně přístupné. Žádný privátní obsah ani tajné klíče do projektu nenahrávej.
