# MIMO SIGNÁL — mini brand manuál v1.0

## Zaměření
České animované příběhy: horor, sci-fi, záhady, paranormálno.
Značka pro publikum, nikoli název vývojářského nástroje.

**Název:** MIMO SIGNÁL  
**Požadovaný handle:** @mimosignal (dostupnost na TikToku, Instagramu a YouTube je nutné nezávisle ověřit)  
**Claim:** Příběhy za hranicí reality.  
**Hlas značky:** napínavý, filmový, strohý, zvědavost bez laciného clickbaitu.

## Vizuální systém
- Primární: #081524 (ink navy)
- Akcent: #64EADF (ghost signal / tyrkys)
- Důraz, hrozba, PART: #FF687B (signal warning)
- Světlý text: #EFFBFF
- Sekundární text: #A9D6DF
- Fonty: systémový tučný sans serif, bez nutnosti kupovat licenci.
- Logo: záměrně přerušený signál + přes diagonálu rušivý prvek.
- Assety: `assets/mimo-signal-logo.svg`, `assets/mimo-signal-wordmark.svg`.

## Grafika a styl videí
Originální stylizované 2.5D prostředí, dramatické světlo a mlha, tmavší paleta s barevnými signálními akcenty. Postava musí mít skutečně animované části těla; samotný zoom statického obrázku nestačí. HUD používat pouze tam, kde je součástí děje.

## Cover 1080 × 1920
1. Nahoře malé logo/název MIMO SIGNÁL a žánr.
2. Dominantní *hook* (ideálně 4–9 slov, výjimečně delší).
3. Uprostřed obraz z příběhu / postava / dějový symbol.
4. Dole název série + PART 01 / PART 02.
5. Bezpečná okrajová zóna: přibližně 70 px; počítat s překryvy platforem.
6. Důraz na čitelnost v miniaturním náhledu.

## Posledních 2,5 sekundy videa
- **Pokračování plánované:** cliffhanger / PART 02 / POKRAČOVÁNÍ PŘÍŠTĚ.
- **Samostatný příběh:** otázka / KONEC PŘÍBĚHU.
- Neslibovat pokračování, pokud `nextPartPlanned` není `true`.
- V základu bez automatické publikace; vše ručně.

## Datový model pro budoucí dashboard
`storyboard.json`: `brand`, `series.title`, `part`, `nextPart`, `nextPartPlanned`, `coverHook`, `endHook`, `endPrompt`; scény i dabing v `scenes`.

## Poznámka k produktovému názvu
Veřejná značka a kanál: **MIMO SIGNÁL**. Technický repozitář může dál nést původní název `story-studio` (šetří migraci URL). Webovou administrační aplikaci lze později pojmenovat „MIMO SIGNÁL · Studio“.
