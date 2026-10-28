## Uporabniške vloge

| Vloga | Kaj lahko pocne | Cesa ne more |
| ----- | --------------- | ------------ |
| Organizator | Ustvari turnir, določi pravila, povabi administratorje in upravlja potek turnirja. | Ne more upravljati turnirjev drugih organizatorjev. |
| Administrator | Upravlja prijave, določa termine tekem in vnaša rezultate. | Ne more spreminjati turnirjev, za katere nima dovoljenja. |
| Igralec | Ustvari ekipo, povabi soigralce, spremlja tekme in rezultate. Ce je vodja ekipe je mozna prijava ekipe na turnir | Ne more spreminjati rezultatov ali upravljati turnirjev. |
| Obiskovalec | Pregleduje turnirje, ekipe in brackete | Ne more ustvarjati ekip ali se prijavljati na turnirje. |

## Predvidene funkcionalnosti
| St. | Funkcionalnost | MVP |
| -- | -------------- | --- |
| 1 | Registracija in prijava uporabnikov | DA |
| 2 | Ustvarjanje ekip in povabila soigralcem | DA |
| 3 | Ustvarjanje turnirjev | DA |
| 4 | Prijavljanje ekip na turnirje | DA |
| 5 | Potrjevanje pripravljenosti ekip (lock-in) | DA |
| 6 | Samodejno generiranje bracketa | DA |
| 7 | Beleženje rezultatov in samodejna posodobitev bracketa | DA |
| 8 | Dodeljevanje administratorjev turnirjem | NE |
| 9 | Določanje terminov posameznih tekem | NE |
| 10 | Spremljanje bracketa in rezultatov | NE |
| 11 | Chat room z adminom, ki je bil dodeljen k tekmi | NE |
| 12 | Pregled zgodovine odigranih tekem posameznega igralca | NE |
| 13 | Iskanje turnirjev po imenu | DA |
| 14 | Pregled profilov ekip in njihovih članov | NE |
| 15 | Arhiv zaključenih turnirjev | NE |
| 16 | Live update kaj se dogaja v igri (integracija z RIOT api) | NE |

## Kasnejše nadgradnje

| St. | Funkcionalnost |
| -- | -------------- |
| 1 | Podpora za double elimination |
| 3 | Statistika igralca (winrate, KDA...) |
| 4 | Sistem tockovanja ekip in lestivca najboljsih |
| 5 | Obvestila o prihajajocih tekmah |
| 6 | Podpora turnirjem BO3 in BO5 |
| 7 | Podpora Group stage |
| 8 | Podpora Seedingu |
| 9 | Podpora Waitlist (v primeru da je prevec prijav se ekipa da na waitlist) |

## Out of scope

| St. | Funkcionalnost |
| -- | -------------- |
| 1 | Organizacija turnirjev za druge videoigre |
| 2 | Plačevanje prijavnin in denarnih nagrad |
| 3 | Samodejno ustvarjanje LoL lobbyjev |
| 4 | Mobilna aplikacija za Android in iOS |