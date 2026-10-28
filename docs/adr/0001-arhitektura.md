# 0001 – Arhitektura odjemalec–strežnik

## Kontekst in problem
DemaciaHub potrebuje spletni vmesnik, strežniško logiko za turnirje in skupno podatkovno bazo.

## Obravnavane alternative
- Odjemalec–strežnik s tremi deli (frontend, backend, baza)
- Monolitna spletna aplikacija s strežniškim izrisom strani

## Sprejeta odločitev
Izbrali smo **odjemalec–strežnik z ločenim frontendom, backendom in bazo**, ker lahko uporabniški vmesnik razvijamo ločeno od logike turnirjev.

## Posledice
- **Pozitivno:** Lažje vzdrževanje in ločen razvoj delov aplikacije.
- **Negativno:** Potrebna je komunikacija med frontendom in backendom.
