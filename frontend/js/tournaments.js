
const API_URL = "http://127.0.0.1:3000/api";

async function naloziTurnirje() {
    const seznam = document.getElementById("tournaments-list");

    try {
        const odgovor = await fetch(API_URL + "/tournaments", {
            credentials: "include"
        });

        const turnirji = await odgovor.json();

        if (!odgovor.ok) {
            throw new Error(turnirji.sporocilo);
        }

        seznam.replaceChildren();

        if (turnirji.length === 0) {
            seznam.textContent = "No upcoming tournaments available.";
            return;
        }

        for (const turnir of turnirji) {
            const kartica = document.createElement("div");
            kartica.className = "tournament-item";

            const ime = document.createElement("h3");
            ime.textContent = turnir.name;

            const opis = document.createElement("p");
            opis.textContent = turnir.description;

            const datum = document.createElement("p");
            datum.textContent = "Start: " +
                new Date(turnir.startDate).toLocaleString("en-GB");

            const ekipe = document.createElement("p");
            ekipe.textContent = "Max teams: " + turnir.maxTeams;

            kartica.appendChild(ime);
            kartica.appendChild(opis);
            kartica.appendChild(datum);
            kartica.appendChild(ekipe);

            seznam.appendChild(kartica);
        }

    } catch (error) {
        seznam.textContent = error.message;
    }
}

naloziTurnirje();
