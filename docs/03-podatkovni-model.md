# Podatkovni model

Za shranjevanje podatkov bo uporabljena podatkovna baza MongoDB, za povezovanje z Node.js pa knjižnica Mongoose. Podatkovni model bo sestavljen iz šestih glavnih zbirk.

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string username
        string email
        string password
        ObjectId teamId FK
    }

    TEAM {
        ObjectId _id PK
        string name
        ObjectId captainId FK
    }

    TEAM_INVITE {
        ObjectId _id PK
        ObjectId teamId FK
        ObjectId userId FK
        string status
    }

    TOURNAMENT {
        ObjectId _id PK
        string name
        string description
        string rules
        ObjectId organizerId FK
        ObjectId_array adminIds FK
        int maxTeams
        date startDate
        string status
    }

    REGISTRATION {
        ObjectId _id PK
        ObjectId tournamentId FK
        ObjectId teamId FK
        string status
        date registeredAt
        date confirmedAt
    }

    MATCH {
        ObjectId _id PK
        ObjectId tournamentId FK
        ObjectId team1Id FK
        ObjectId team2Id FK
        int round
        int matchNumber
        ObjectId winnerId FK
        string status
        ObjectId nextMatchId FK
        int nextMatchSlot
    }

    TEAM |o--o{ USER : "ima_clane"
    USER ||--o| TEAM : "vodi"

    USER ||--o{ TEAM_INVITE : "prejme"
    TEAM ||--o{ TEAM_INVITE : "poslje"

    USER ||--o{ TOURNAMENT : "organizira"
    USER }o--o{ TOURNAMENT : "administrira"

    TEAM ||--o{ REGISTRATION : "prijavi"
    TOURNAMENT ||--o{ REGISTRATION : "prejme"

    TOURNAMENT ||--o{ MATCH : "vsebuje"
    TEAM }o--o{ MATCH : "sodeluje"
    MATCH |o--o{ MATCH : "naslednja_tekma"
```

## Opis podatkovnega modela

Za shranjevanje podatkov bo uporabljena podatkovna baza MongoDB, za povezovanje z aplikacijo pa knjižnica Mongoose. Podatkovni model bo sestavljen iz šestih med seboj povezanih zbirk.

### USER
Hrani podatke o registriranih uporabnikih, kot so uporabniško ime, elektronski naslov in geslo. Vsak uporabnik lahko pripada največ eni ekipi.

### TEAM
Hrani podatke o ekipah, njihovih imenih in vodjih (`captainId`). Posamezna ekipa lahko vsebuje največ pet igralcev.

### TEAM_INVITE
Hrani povabila uporabnikov v ekipe. Vsako povabilo povezuje uporabnika z ekipo in vsebuje stanje povabila (pending, accepted, rejected).

### TOURNAMENT
Hrani podatke o turnirjih, njihovih pravilih, datumih in omejitvah. Vsak turnir ima organizatorja (`organizerId`) in lahko vsebuje več administratorjev (`adminIds`). Administratorji imajo pravice samo na turnirjih v katere so bili dodani.

### REGISTRATION
Povezuje ekipe s turnirji in hrani stanje njihove prijave. Omogoča tudi spremljanje potrditve pripravljenosti ekip v fazi lock-in.

### MATCH
Hrani podatke o posameznih tekmah, ekipah, rezultatih in zmagovalcih. S poljema `nextMatchId` in `nextMatchSlot` omogoča povezovanje tekem ter samodejno napredovanje zmagovalcev v naslednji krog turnirja.

## Povezave med zbirkami

Zbirke so med seboj povezane z referencami `ObjectId`. Uporabnik lahko pripada največ eni ekipi, posamezna ekipa pa lahko sodeluje na več turnirjih. Vsak turnir vsebuje več prijav in tekem. Posamezne tekme so povezane med seboj, kar omogoča samodejno posodabljanje bracketa.

