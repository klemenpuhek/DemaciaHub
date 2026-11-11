const API_URL = "http://127.0.0.1:3000/api";
const tournamentId = new URLSearchParams(window.location.search).get("id");

const signupButton = document.getElementById("signup-button");
const signupMessage = document.getElementById("signup-message");

let turnir = null;
let prijavaStatus = null;
let jeKapetan = false;

async function naloziTurnir() {
    try {
        const odgovor = await fetch(API_URL + "/tournaments/" + tournamentId, {
            credentials: "include",
        });

        const rezultat = await odgovor.json();

        if (!odgovor.ok) {
            throw new Error(rezultat.sporocilo);
        }

        turnir = rezultat.turnir;
        prijavaStatus = rezultat.prijavaStatus;
        jeKapetan = rezultat.jeKapetan;

        document.getElementById("tournament-name").textContent = turnir.name;
        document.getElementById("overview-name").textContent = turnir.name;
        document.getElementById("overview-description").textContent =
            turnir.description;
        document.getElementById("overview-rules").textContent = turnir.rules;
        document.getElementById("overview-teams").textContent = turnir.maxTeams;

        document.getElementById("overview-date").textContent = new Date(
            turnir.startDate,
        ).toLocaleString("en-GB");

        posodobiGumb();
    } catch (error) {
        document.getElementById("tournament-name").textContent = error.message;
        signupButton.disabled = true;
    }
}

function posodobiGumb() {
    if (!turnir) return;

    const zdaj = new Date();
    const zacetek = new Date(turnir.startDate);
    const lockInZacetek = new Date(zacetek.getTime() - 2 * 60 * 60 * 1000);

    signupButton.disabled = true;

    if (prijavaStatus === "confirmed") {
        signupButton.textContent = "LOCKED IN";
    } else if (zdaj >= zacetek || turnir.status !== "upcoming") {
        signupButton.textContent = "REGISTRATION CLOSED";
    } else if (zdaj >= lockInZacetek) {
        if (prijavaStatus === "pending") {
            signupButton.textContent = jeKapetan ? "LOCK IN" : "REGISTERED";
            signupButton.disabled = !jeKapetan;
        } else {
            signupButton.textContent = "REGISTRATION CLOSED";
        }
    } else if (prijavaStatus === "pending") {
        signupButton.textContent = "REGISTERED";
    } else {
        signupButton.textContent = "SIGN UP";
        signupButton.disabled = true;
        if (prijavaStatus === null) {
            signupButton.disabled = false;
        }
    }
}

function nastaviZavihke() {
    const zavihki = document.querySelectorAll(".tournament-tab");
    const sekcije = document.querySelectorAll(".tournament-panel");

    zavihki.forEach((zavihek) => {
        zavihek.addEventListener("click", () => {
            zavihki.forEach((z) => z.classList.remove("active"));
            sekcije.forEach((s) => s.classList.add("hidden"));

            zavihek.classList.add("active");

            document
                .getElementById(zavihek.dataset.tab)
                .classList.remove("hidden");

            if (zavihek.dataset.tab === "bracket") {
                naloziBracket();
            }
        });
    });
}

async function naloziEkipe() {
    const seznam = document.getElementById("registered-teams");

    try {
        const odgovor = await fetch(
            API_URL + "/tournaments/" + tournamentId + "/teams",
            {credentials: "include"},
        );

        const ekipe = await odgovor.json();

        if (!odgovor.ok) {
            throw new Error(ekipe.sporocilo);
        }

        seznam.replaceChildren();

        if (ekipe.length === 0) {
            seznam.textContent = "No teams registered yet.";
            return;
        }

        for (const ekipa of ekipe) {
            const element = document.createElement("div");
            element.className = "registered-team";
            element.textContent = ekipa.name;

            seznam.appendChild(element);
        }
    } catch (error) {
        seznam.textContent = error.message;
    }
}

function nastaviPrijavo() {
    signupButton.addEventListener("click", async () => {
        if (!turnir) return;

        const zacetek = new Date(turnir.startDate);
        const lockInZacetek = new Date(zacetek.getTime() - 2 * 60 * 60 * 1000);

        const jeLockIn =
            prijavaStatus === "pending" &&
            jeKapetan &&
            new Date() >= lockInZacetek;

        const pot = jeLockIn
            ? "/tournaments/" + tournamentId + "/lock-in"
            : "/tournaments/" + tournamentId + "/register";

        signupButton.disabled = true;
        signupMessage.className = "form-message";
        signupMessage.textContent = "";

        try {
            const odgovor = await fetch(API_URL + pot, {
                method: jeLockIn ? "PATCH" : "POST",
                credentials: "include",
            });

            const rezultat = await odgovor.json();

            if (!odgovor.ok) {
                throw new Error(rezultat.sporocilo);
            }

            prijavaStatus = jeLockIn ? "confirmed" : "pending";

            signupMessage.textContent = jeLockIn
                ? "Your team is locked in!"
                : "Your team has been registered successfully!";

            signupMessage.className = "form-message success";

            posodobiGumb();
            await naloziEkipe();
        } catch (error) {
            signupMessage.textContent = error.message;
            signupMessage.className = "form-message error";
            posodobiGumb();
        }
    });
}

async function naloziBracket() {
    const seznam = document.getElementById("bracket-list");

    try {
        const odgovor = await fetch(
            API_URL + "/tournaments/" + tournamentId + "/bracket",
            {credentials: "include"},
        );

        const dvoboji = await odgovor.json();

        if (!odgovor.ok) {
            throw new Error(dvoboji.sporocilo);
        }

        seznam.replaceChildren();

        if (dvoboji.length === 0) {
            seznam.textContent =
                "Bracket will be available when the tournament starts.";
            return;
        }

        const steviloKrogov = Math.max(...dvoboji.map((d) => d.round));

        for (let krog = 1; krog <= steviloKrogov; krog++) {
            const stolpec = document.createElement("div");
            stolpec.className = "bracket-round";

            const naslov = document.createElement("h3");

            if (krog === steviloKrogov) {
                naslov.textContent = "Final";
            } else if (krog === steviloKrogov - 1) {
                naslov.textContent = "Semifinals";
            } else {
                naslov.textContent = "Round " + krog;
            }

            stolpec.appendChild(naslov);

            const dvobojiKroga = dvoboji.filter((d) => d.round === krog);

            for (const dvoboj of dvobojiKroga) {
                const kartica = document.createElement("div");
                kartica.className = "bracket-match";

                const ekipa1 = document.createElement("div");
                const ekipa2 = document.createElement("div");

                ekipa1.className = "bracket-team";
                ekipa2.className = "bracket-team";

                ekipa1.textContent = dvoboj.team1Id?.name || "TBD";

                if (dvoboj.winnerId && !dvoboj.team2Id && krog === 1) {
                    ekipa2.textContent = "BYE";
                } else {
                    ekipa2.textContent = dvoboj.team2Id?.name || "TBD";
                }

                if (dvoboj.winnerId) {
                    if (dvoboj.winnerId._id === dvoboj.team1Id?._id) {
                        ekipa1.classList.add("winner");
                    }

                    if (dvoboj.winnerId._id === dvoboj.team2Id?._id) {
                        ekipa2.classList.add("winner");
                    }
                }

                kartica.appendChild(ekipa1);
                kartica.appendChild(ekipa2);
                stolpec.appendChild(kartica);
            }

            seznam.appendChild(stolpec);
        }
    } catch (error) {
        seznam.textContent = error.message;
    }
}

nastaviZavihke();
nastaviPrijavo();

if (tournamentId) {
    naloziTurnir();
    naloziEkipe();

    setInterval(posodobiGumb, 10000);
} else {
    document.getElementById("tournament-name").textContent =
        "Tournament not found";
    signupButton.disabled = true;
}
