const API_URL = "http://127.0.0.1:3000/api";
const tournamentId = new URLSearchParams(window.location.search).get("id");

const signupButton = document.getElementById("signup-button");
const signupMessage = document.getElementById("signup-message");

async function naloziTurnir() {
    try {
        const odgovor = await fetch(API_URL + "/tournaments/" + tournamentId, {
            credentials: "include",
        });

        const rezultat = await odgovor.json();

        if (!odgovor.ok) {
            throw new Error(rezultat.sporocilo);
        }

        const turnir = rezultat.turnir;

        document.getElementById("tournament-name").textContent = turnir.name;
        document.getElementById("overview-name").textContent = turnir.name;
        document.getElementById("overview-description").textContent =
            turnir.description;
        document.getElementById("overview-rules").textContent = turnir.rules;
        document.getElementById("overview-teams").textContent = turnir.maxTeams;

        document.getElementById("overview-date").textContent = new Date(
            turnir.startDate,
        ).toLocaleString("en-GB");

        if (rezultat.prijavljen) {
            signupButton.textContent = "REGISTERED";
            signupButton.disabled = true;
        } else if (
            new Date(turnir.startDate) <= new Date() ||
            turnir.status !== "upcoming"
        ) {
            signupButton.textContent = "REGISTRATION CLOSED";
            signupButton.disabled = true;
        }
    } catch (error) {
        document.getElementById("tournament-name").textContent = error.message;
        signupButton.disabled = true;
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
        });
    });
}

function nastaviPrijavo() {
    signupButton.addEventListener("click", async () => {
        signupButton.disabled = true;

        try {
            const odgovor = await fetch(
                API_URL + "/tournaments/" + tournamentId + "/register",
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            const rezultat = await odgovor.json();

            if (!odgovor.ok) {
                throw new Error(rezultat.sporocilo);
            }

            signupMessage.textContent =
                "Your team has been registered successfully!";
            signupMessage.className = "form-message success";

            signupButton.textContent = "REGISTERED";
            await naloziEkipe();
        } catch (error) {
            signupMessage.textContent = error.message;
            signupMessage.className = "form-message error";
            signupButton.disabled = false;
        }
    });
}


async function naloziEkipe() {
    const seznam = document.getElementById("registered-teams");

    try {
        const odgovor = await fetch(
            API_URL + "/tournaments/" + tournamentId + "/teams",
            { credentials: "include" }
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


nastaviZavihke();
nastaviPrijavo();

if (tournamentId) {
    naloziTurnir();
    naloziEkipe();
} else {
    document.getElementById("tournament-name").textContent = "Tournament not found";
    signupButton.disabled = true;
}
