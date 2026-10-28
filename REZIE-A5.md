# MIMO SIGNÁL — A5: režijní revize

## Proč A4 působila staticky

Původní video mělo 6 obrazů po 12,5 sekundách, vždy z téměř totožného pohledu. Nepřidávalo nové vizuální informace dost rychle. Pouhé zvětšení SVG postavy nestačí k získání kvalitní herní estetiky.

## Nový režijní rytmus

- 6 hlasových úseků po 12,5 s **zůstává** kvůli kompatibilitě se scénářem a zvukem.
- 4 záběry na každý úsek = 24 různých situací; délky 2–4 s.
- Důraz na nové informace každé cca 3 sekundy: noční les → chůze → kroky → vibrace telefonu → odesílatel → reakce → zpráva → pronásledování → mapa → odhalení.
- Jiné typy vizuálního záběru: okolí, detail telefonu, detail očí, chůze, útěk, vzdálená silueta.
- Pokračování PART 02 je přiznáno až v závěrečných 2,5 s.
- Režim manual (dabing v CapCutu) a režim ai (Piper) zůstávají.

## Limity A5

A5 je **režijní a technická revize**, nikoliv hotový profesionálně ilustrovaný seriál. SVG postava má stále omezené pohybové pózy, zejména při zatáčení, práci s předměty a mimice. Pro dosažení stylu referencí bude potřeba vytvořit výtvarné assets: oddělené vrstvy hlavy, trupu, paží, předloktí, rukou, stehen, lýtek, obličeje a perspektivní varianty postavy, pozadí ve více vrstvách a rigovatelné rekvizity. Doporučený další milník je 8–12sekundový kvalitní ilustrovaný animační test (chůze → vibrace → detail telefonu → reakce), nikoliv další celé video v jednoduché SVG estetice.

## Testování

Ověř metadata, Python exporty a ZIP. Render přes GitHub Actions nutno ověřit zvlášť; zde bez přístupu k npm registru nelze instalovat Remotion a render spustit. Žádná část animovaného výsledku není označována za skutečně otestovanou.
