# DemaciaHub

DemaciaHub je spletna aplikacija za organizacijo in upravljanje turnirjev v igri League of Legends. Namenjena je igralcem, ekipam in organizatorjem turnirjev.

Aplikacija omogoča registracijo uporabnikov, ustvarjanje ekip, povabila soigralcem, prijavljanje na turnirje, potrjevanje pripravljenosti ekip (lock-in), samodejno generiranje turnirskega drevesa (bracketa) ter beleženje rezultatov tekem.

Cilj projekta je poenostaviti organizacijo turnirjev in omogočiti upravljanje ekip, tekem in rezultatov.

## Uporabljene tehnologije

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js, Socket.io, Mongoose
- **Podatkovna baza:** MongoDB
- **Upravljanje uporabniških sej:** express-session
- **Razvojno orodje:** Nodemon

## Dokumentacija

Projektna dokumentacija je dostopna v mapi [docs](./docs/).

Vključuje zasnovo rešitve, opis funkcionalnosti, podatkovni model, uporabniške zgodbe in wireframe zaslone..

## Zagon aplikacije

### 1. Predpogoji
- Node.js in npm
- MongoDB Community Server
- MongoDB Compass (za pregledovanje podatkov)

### 2. Kloniranje repozitorija
```bash
git clone https://github.com/klemenpuhek/DemaciaHub.git
cd DemaciaHub/backend
```

### 3. Namestitev odvisnosti
```bash
npm install
```

### 4. Konfiguracija okolja

Zaženite lokalni MongoDB strežnik in v mapi `backend` ustvarite datoteko `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/demaciahub
SESSION_SECRET=poljuben-dolg-nakljucen-niz-znakov
```

MongoDB bo podatkovno bazo `demaciahub` ustvaril ob prvem zapisovanju podatkov.

### 5. Zagon aplikacije
```bash
npm run dev
```

Aplikacijo odprite na naslovu:

**http://localhost:3000**

Frontend in backend se izvajata na istem strežniku.