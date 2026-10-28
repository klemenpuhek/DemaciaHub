# Uporabniške zgodbe

## US-01: Registracija in prijava uporabnikov

**Funkcionalnost:** Registracija in prijava uporabnikov  
**Uporabniška vloga:** Gost

**Uporabniška zgodba:**

Kot gost želim ustvariti uporabniški račun in se prijaviti v aplikacijo, da lahko sodelujem v ekipah in se prijavljam na turnirje.

**Acceptance criteria:**
- Uporabnik se lahko registrira z uporabniškim imenom, e-poštnim naslovom in geslom.
- Sistem prepreči registracijo, če sta uporabniško ime ali e-poštni naslov že uporabljena.
- Ob uspešni prijavi sistem ustvari uporabniško sejo, ob napačnih prijavnih podatkih pa prikaže sporočilo o napaki.

## US-02: Ustvarjanje ekip in povabila soigralcem

**Funkcionalnost:** Ustvarjanje ekip in povabila soigralcem  
**Uporabniška vloga:** Registrirani uporabnik

**Uporabniška zgodba:**

Kot registrirani uporabnik želim ustvariti ekipo in povabiti druge igralce, da lahko skupaj sodelujemo na turnirjih.

**Acceptance criteria:**
- Uporabnik lahko ustvari ekipo z vnosom njenega imena, s tem avtomatsko postane njen kapetan.
- Sistem prepreči ustvarjanje nove ekipe uporabniku, ki je že član druge ekipe.
- Kapetan lahko pošlje povabilo registriranemu uporabniku, ki še ni član nobene ekipe.
- Povabljeni uporabnik lahko povabilo sprejme ali zavrne, pri tem pa sistem prepreči sprejem, če ima ekipa že pet članov.

## US-03: Ustvarjanje turnirjev

**Funkcionalnost:** Ustvarjanje turnirjev  
**Uporabniška vloga:** Organizator turnirja

**Uporabniška zgodba:**

Kot organizator želim ustvariti nov turnir in določiti njegove osnovne podatke, da lahko ekipam omogočim sodelovanje v tekmovanju.

**Acceptance criteria:**
- Organizator lahko vnese ime turnirja, opis, pravila, datum in uro začetka ter največje število sodelujočih ekip.
- Sistem preveri, ali so izpolnjena vsa obvezna polja.
- Sistem prepreči ustvarjanje turnirja z datumom začetka v preteklosti ali z neveljavnim številom ekip.
- Ob uspešnem ustvarjanju sistem shrani turnir in ga prikaže med razpoložljivimi turnirji.

## US-04: Prijavljanje ekip na turnirje

**Funkcionalnost:** Prijavljanje ekip na turnirje  
**Uporabniška vloga:** Kapetan ekipe

**Uporabniška zgodba:**

Kot kapetan ekipe želim svojo ekipo prijaviti na razpoložljiv turnir, da lahko skupaj s soigralci sodelujemo v tekmovanju.

**Acceptance criteria:**
- Kapetan lahko prijavi svojo ekipo samo na turnir, ki še sprejema prijave.
- Sistem omogoči prijavo samo ekipi, ki ima natanko pet članov.
- Sistem prepreči ponovno prijavo iste ekipe na isti turnir.
- Sistem prepreči prijavo, če je največje dovoljeno število ekip na turnirju že doseženo.

## US-05: Potrjevanje pripravljenosti ekip (lock-in)

**Funkcionalnost:** Potrjevanje pripravljenosti ekip (lock-in)  
**Uporabniška vloga:** Kapetan ekipe

**Uporabniška zgodba:**

Kot kapetan ekipe želim pred začetkom turnirja potrditi pripravljenost svoje ekipe, da organizator ve, da bomo sodelovali na tekmovanju.

**Acceptance criteria:**
- Sistem omogoči potrditev pripravljenosti od dveh ur pred začetkom turnirja do njegovega začetka.
- Pripravljenost lahko potrdi samo kapetan ekipe, ki je prijavljena na turnir.
- Ob uspešni potrditvi sistem spremeni status prijave ekipe v `confirmed`.
- Ekipe, ki do začetka turnirja ne potrdijo pripravljenosti, niso vključene v generiranje bracketa.

## US-06: Samodejno generiranje bracketa

**Funkcionalnost:** Samodejno generiranje bracketa  
**Uporabniška vloga:** Organizator turnirja

**Uporabniška zgodba:**

Kot organizator želim samodejno ustvariti bracket na podlagi potrjenih ekip, da lahko sistem določi pare tekem in potek tekmovanja.

**Acceptance criteria:**
- Organizator lahko sproži generiranje bracketa po zaključku obdobja za potrditev pripravljenosti ekip.
- Sistem v bracket vključi samo ekipe, ki so potrdile sodelovanje.
- Sistem samodejno razporedi ekipe v pare in ustvari BO1 bracket.
- Če število potrjenih ekip sodo, sistem dodeli potrebne proste prehode v naslednji krog.
- Sistem prepreči ponovno generiranje bracketa, če ta za izbrani turnir že obstaja.

## US-07: Beleženje rezultatov in samodejna posodobitev bracketa

**Funkcionalnost:** Beleženje rezultatov in samodejna posodobitev bracketa  
**Uporabniška vloga:** Organizator turnirja

**Uporabniška zgodba:**

Kot organizator želim vnesti rezultate odigranih tekem, da lahko sistem samodejno posodobi bracket in določi ekipe, ki napredujejo v naslednji krog.

**Acceptance criteria:**
- Organizator lahko pri posamezni tekmi določi zmagovalca med ekipama, ki sodelujeta na tekmi.
- Sistem prepreči izbiro ekipe, ki ni udeleženec izbrane tekme.
- Ob shranjevanju rezultata sistem označi tekmo kot zaključeno.
- Zmagovalna ekipa se samodejno uvrsti v ustrezno tekmo naslednjega kroga.
- Ob zaključku finalne tekme sistem določi zmagovalca turnirja.

## US-08: Dodeljevanje administratorjev turnirjem

**Funkcionalnost:** Dodeljevanje administratorjev turnirjem  
**Uporabniška vloga:** Organizator turnirja

**Uporabniška zgodba:**

Kot organizator želim posameznemu turnirju dodeliti dodatne administratorje, da lahko pomagajo pri upravljanju tekem in poteka tekmovanja.

**Acceptance criteria:**
- Organizator lahko poišče registrirane uporabnike po uporabniškem imenu in jih doda kot administratorje turnirja.
- Sistem prepreči ponovno dodelitev istega uporabnika kot administratorja istega turnirja.
- Dodeljeni administratorji so prikazani na seznamu administratorjev posameznega turnirja.
- Organizator lahko odstrani dodeljenega administratorja, pri čemer ta izgubi administratorske pravice za izbrani turnir.

## US-09: Določanje terminov posameznih tekem

**Funkcionalnost:** Določanje terminov posameznih tekem  
**Uporabniška vloga:** Organizator turnirja

**Uporabniška zgodba:**

Kot organizator želim določiti datum in uro posameznih tekem, da lahko igralci pravočasno izvedo, kdaj morajo biti pripravljeni na igranje.

**Acceptance criteria:**
- Organizator lahko posamezni rundi določi datum in uro začetka.
- Sistem prepreči nastavitev termina, ki je pred začetkom turnirja.
- Določeni termin se prikaže nad bracketom.

## US-10: Spremljanje bracketa in rezultatov

**Funkcionalnost:** Spremljanje bracketa in rezultatov  
**Uporabniška vloga:** Obiskovalec

**Uporabniška zgodba:**

Kot obiskovalec želim spremljati bracket in rezultate posameznih tekem, da lahko vidim potek turnirja in napredovanje ekip.

**Acceptance criteria:**
- Uporabnik lahko odpre bracket izbranega turnirja brez prijave v aplikacijo.
- Sistem prikaže vse kroge turnirja in pare ekip v posameznih tekmah.
- Pri zaključenih tekmah sistem prikaže rezultat in označi zmagovalno ekipo.
- Ob ponovnem nalaganju strani so prikazani najnovejši shranjeni rezultati in posodobljeno napredovanje ekip.

## US-11: Chat room z administratorjem tekme

**Funkcionalnost:** Chat room z administratorjem, dodeljenim k tekmi  
**Uporabniška vloga:** Igralec ekipe

**Uporabniška zgodba:**

Kot igralec želim v klepetalnici posamezne tekme komunicirati z dodeljenim administratorjem, da lahko hitro rešujemo težave in se dogovarjamo o poteku tekme.

**Acceptance criteria:**
- Do klepetalnice lahko dostopajo samo igralci obeh ekip, ki sodelujeta na tekmi, in administrator, dodeljen tej tekmi.
- Udeleženec klepetalnice lahko pošlje besedilno sporočilo, ki ne sme biti prazno.
- Poslana sporočila se prikažejo vsem uporabnikom, ki imajo odprto klepetalnico, brez ponovnega nalaganja strani.
- Pri vsakem sporočilu sta prikazana uporabniško ime pošiljatelja in čas pošiljanja.
- Sporočila se shranijo in ostanejo vidna ob ponovnem odprtju klepetalnice.

## US-12: Pregled zgodovine odigranih tekem posameznega igralca

**Funkcionalnost:** Pregled zgodovine odigranih tekem posameznega igralca  
**Uporabniška vloga:** Registrirani uporabnik

**Uporabniška zgodba:**

Kot registrirani uporabnik želim pregledati zgodovino svojih odigranih tekem, da lahko spremljam svoje pretekle nastope in rezultate na turnirjih.

**Acceptance criteria:**
- Uporabnik lahko v svojem profilu odpre seznam tekem, na katerih je sodeloval.
- Sistem prikaže samo zaključene tekme, pri katerih je uporabnik sodeloval kot član ene izmed ekip.
- Za vsako tekmo sistem prikaže ime turnirja, datum tekme, nasprotno ekipo in rezultat.
- Tekme so razvrščene po datumu od najnovejše do najstarejše.
- Če uporabnik še ni sodeloval na nobeni zaključeni tekmi, sistem prikaže ustrezno sporočilo.

## US-13: Iskanje turnirjev po imenu

**Funkcionalnost:** Iskanje turnirjev po imenu  
**Uporabniška vloga:** Obiskovalec

**Uporabniška zgodba:**

Kot obiskovalec želim iskati turnirje po imenu, da lahko hitro najdem turnir, ki me zanima.

**Acceptance criteria:**
- Uporabnik lahko v iskalno polje vnese ime ali del imena turnirja.
- Sistem vrne vse turnirje, katerih ime vsebuje vneseno besedilo, ne glede na velike ali male črke.
- Pri vsakem rezultatu sistem prikaže ime turnirja, datum začetka in status.
- Če noben turnir ne ustreza iskalnemu izrazu, sistem prikaže sporočilo Ni najdenih turnirjev.
- Ko uporabnik izprazni iskalno polje, sistem ponovno prikaže celoten seznam turnirjev.

## US-14: Pregled profilov ekip in njihovih članov

**Funkcionalnost:** Pregled profilov ekip in njihovih članov  
**Uporabniška vloga:** Obiskovalec

**Uporabniška zgodba:**

Kot obiskovalec želim pregledati profile ekip in njihove člane, da lahko izvem več o ekipah, ki sodelujejo na turnirjih.

**Acceptance criteria:**
- Uporabnik lahko odpre profil posamezne ekipe brez prijave v aplikacijo.
- Sistem prikaže ime ekipe in uporabniško ime njenega kapetana.
- Sistem prikaže seznam vseh trenutnih članov ekipe z njihovimi uporabniškimi imeni.
- Ob izbiri posameznega člana lahko uporabnik odpre njegov javni profil.

## US-15: Arhiv zaključenih turnirjev

**Funkcionalnost:** Arhiv zaključenih turnirjev  
**Uporabniška vloga:** Obiskovalec

**Uporabniška zgodba:**

Kot obiskovalec želim pregledati arhiv zaključenih turnirjev, da lahko preverim pretekle rezultate, zmagovalce in sodelujoče ekipe.

**Acceptance criteria:**
- Sistem v arhivu prikaže samo turnirje s statusom `completed`.
- Pri vsakem zaključenem turnirju prikaže ime, datum začetka in zmagovalno ekipo.
- Ob izbiri turnirja lahko uporabnik pregleda njegov končni bracket in rezultate vseh tekem.
- Zaključeni turnirji ostanejo dostopni tudi po ustvarjanju novih turnirjev.
- Če v arhivu še ni zaključenih turnirjev, sistem prikaže ustrezno sporočilo.