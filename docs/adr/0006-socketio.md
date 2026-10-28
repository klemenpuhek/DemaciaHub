# 0006 – Socket.IO za klepet v realnem času

## Kontekst in problem
Načrtovana klepetalnica med igralci in administratorjem tekme potrebuje hitro izmenjavo sporočil.

## Obravnavane alternative
- Socket.IO
- Periodično preverjanje novih sporočil prek REST API-ja

## Sprejeta odločitev
Za **prihodnjo izvedbo klepetalnice načrtujemo Socket.IO**, ker omogoča sprotno pošiljanje sporočil brez osveževanja strani.

## Posledice
- **Pozitivno:** Sporočila se lahko prikazujejo sproti.
- **Negativno:** Potrebno bo upravljati povezave uporabnikov in preverjati dostop do klepetalnic.
