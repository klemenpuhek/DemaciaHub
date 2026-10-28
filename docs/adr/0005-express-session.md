# 0005 – Avtentikacija z express-session

## Kontekst in problem
Po prijavi mora sistem prepoznati uporabnika in preverjati njegove pravice pri ekipah ter turnirjih.

## Obravnavane alternative
- Strežniške seje z express-session
- Avtentikacija z žetoni JWT

## Sprejeta odločitev
Izbrali smo **express-session**, ker omogoča upravljanje prijave prek strežniške seje in piškotka v brskalniku.

## Posledice
- **Pozitivno:** Preprosto preverjanje prijavljenega uporabnika in razveljavitev seje ob odjavi.
- **Negativno:** Za uporabo v produkciji potrebujemo varno hrambo sej, za kaj ta resitev ni najboljsa.
