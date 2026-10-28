# 0004 – MongoDB in Mongoose za podatke

## Kontekst in problem
Shraniti moramo uporabnike, ekipe, povabila, turnirje, prijave in tekme ter jih med seboj povezati.

## Obravnavane alternative
- MongoDB z Mongoose
- PostgreSQL z relacijskimi tabelami

## Sprejeta odločitev
Izbrali smo **MongoDB in Mongoose**, ker dokumentni model ustreza načrtovanim zbirkam, Mongoose pa omogoča definiranje shem in preverjanje podatkov.

## Posledice
- **Pozitivno:** Prilagodljivi dokumenti in sheme v aplikacijski kodi.
- **Negativno:** Povezave med zbirkami in doslednost podatkov zahtevajo dodatno preverjanje.
