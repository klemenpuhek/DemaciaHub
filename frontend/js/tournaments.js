const API_URL = "/api";


async function naloziTurnirje() {
    const ongoing = document.getElementById("ongoing-tournaments");
    const upcoming = document.getElementById("upcoming-tournaments");

    try {
        const odgovor = await fetch(API_URL + "/tournaments", {
            credentials: "include"
        });

        const turnirji = await odgovor.json();

        if (!odgovor.ok) {
            throw new Error(turnirji.sporocilo);
        }

        ongoing.replaceChildren();
        upcoming.replaceChildren();

        for (const turnir of turnirji) {
            const kartica = document.createElement("a");
            kartica.className = "tournament-item";
            kartica.href = "tournament.html?id=" + turnir._id;

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

            if (new Date(turnir.startDate) <= new Date()) {
                ongoing.appendChild(kartica);
            } else {
                upcoming.appendChild(kartica);
            }
        }

        if (ongoing.children.length === 0) {
            ongoing.textContent = "No ongoing tournaments.";
        }

        if (upcoming.children.length === 0) {
            upcoming.textContent = "No upcoming tournaments.";
        }

    } catch (error) {
        ongoing.textContent = error.message;
        upcoming.textContent = error.message;
    }
}

naloziTurnirje();


naloziTurnirje();
