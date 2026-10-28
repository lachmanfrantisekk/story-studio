# Story Studio — etapa A3: volba dabingu (vlastní hlas / automatický Piper)

Tato aktualizace **zachovává animovaný pilot** „Poslední signál“ a jeho původní
šest scén. Nově jde při spuštění workflow vybrat, zda chceš vlastní hlas pro
nahrání v CapCutu, nebo automatický český hlas Piper.

## Co bude v ZIPu s výsledkem

- `pilot.mp4` — 75 s / 1080 × 1920 / 30 FPS / animace + ambient a zvukové efekty.
- `scenar-pro-dabing.txt` — celý český text vypravěče, scény a orientační časy.
- `dabing-casovani.srt` — časované repliky vypravěče jako samostatný soubor.
- `cover.jpg` — obálka získaná z videa.
- `popisek.txt` — popisek pro sociální sítě.

Režim `manual` **neobsahuje žádný AI hlas**, pouze ambient a efekty. Režim `ai`
se navíc pokusí nainstalovat Piper, stáhnout volně dostupný český hlas a
vložit ho do výsledného videa. Soubor scénáře dostaneš **v obou režimech**.
Vlastní hlas pak do MP4 nahraješ v CapCutu, případně upravíš hlasitost pozadí.
Titulky se již vykreslují přímo do videa; SRT je samostatná pomůcka pro hlas,
nikoli automaticky editovatelná kopie vypálených titulků.

## Aktualizace na GitHubu bez terminálu

1. Stáhni a rozbal tento ZIP.
2. V GitHub Desktop otevři lokální složku svého repozitáře `story-studio`.
3. **Zkopíruj obsah** ZIPu do kořene repozitáře a potvrď přepsání souborů.
4. GitHub Desktop → `Commit to main` → `Push origin`.
5. GitHub → tvůj repozitář → `Actions` → `Render pilot` → `Run workflow`.
6. V rozbalovací volbě **voice_mode** vyber `manual` (vlastní dabing)
   nebo `ai` (automatický Piper), větev nech `main`, potvrď `Run workflow`.
7. Po zeleném dokončení otevři běh, v **Artifacts** stáhni
   `story-studio-pilot-a3-manual` nebo `story-studio-pilot-a3-ai`.
8. Rozbal ZIP a otevři `scenar-pro-dabing.txt`. Pro CapCut importuj `pilot.mp4`.
   Vlož vlastní audio (Record / Voiceover) a řiď se časy v scénáři.

## Bezpečnost, licence a limity

Není použit žádný placený cloud ani API klíče. Rendering probíhá v GitHub
Actions, nic se nerenderuje na notebooku. V `manual` se nestahuje model Piper.
U veřejného repozitáře počítej s viditelností běhů, logů a možná i artifactů.
Výsledky workflow se uchovávají jeden den. GitHub Actions mají své provozní
podmínky a kapacitní limity, nejde o garantovanou neomezenou službu.

Model `cs_CZ-jirka-medium` se stahuje z rhasspy/piper-voices; použití
konkrétního hlasu a licence je před zveřejněním nutné ověřit u zdroje.
Ambient a zvukové efekty generuje Python bez převzatých hudebních nahrávek.

## Testování a stav

Původní video bylo uživatelem zkontrolováno (7/7). Nové generování scénáře,
SRT a ambientu lze testovat lokálně bez renderu. **Aktualizovaný Remotion render
v GitHub Actions ani skutečný Piper TTS nejsou zatím nezávisle ověřené.**
Při červeném běhu otevři selhaný krok a zkopíruj chybovou zprávu.
