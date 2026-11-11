const API_URL = "/api";

async function apiZahtevek(pot, metoda = "GET", podatki = null) {
    const nastavitve = {
        method: metoda,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (podatki !== null) {
        nastavitve.body = JSON.stringify(podatki);
    }

    const odgovor = await fetch(API_URL + pot, nastavitve);
    const rezultat = await odgovor.json();

    if (!odgovor.ok) {
        throw new Error(rezultat.sporocilo || "Napaka pri zahtevku.");
    }

    return rezultat;
}

function prikaziSporocilo(sporocilo, tip) {
    const element = document.getElementById("team-message");

    element.textContent = sporocilo;
    element.className = "form-message " + tip;
}

async function preveriPrijavo() {
    try {
        const rezultat = await apiZahtevek("/auth/me");
        return rezultat.uporabnik;
    } catch (error) {
        window.location.href = "index.html";
        return null;
    }
}

async function prikaziEkipo(teamId, userId) {
    const rezultat = await apiZahtevek("/teams/" + teamId);
    const ekipa = rezultat.ekipa;

    document.getElementById("current-team-name").textContent = ekipa.name;

    const captainId = ekipa.captainId._id || ekipa.captainId;
    const jeKapetan = String(captainId) === String(userId);

    const leaveButton = document.getElementById("leave-team-button");

    if (!jeKapetan) {
        leaveButton.classList.remove("hidden");
    }

    document.getElementById("current-team-role").textContent = jeKapetan
        ? "Team Captain"
        : "Team Member";

    document.getElementById("has-team").classList.remove("hidden");

    if (jeKapetan) {
        document.getElementById("invite-section").classList.remove("hidden");

        nastaviPovabila(teamId);
    }
}

function nastaviUstvarjanjeEkipe() {
    const form = document.getElementById("create-team-form");
    const gumb = document.getElementById("show-create-team");

    gumb.addEventListener("click", () => {
        gumb.classList.add("hidden");
        form.classList.remove("hidden");
    });

    document
        .getElementById("cancel-create-team")
        .addEventListener("click", () => {
            form.classList.add("hidden");
            gumb.classList.remove("hidden");
            form.reset();
        });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("team-name").value.trim();

        try {
            await apiZahtevek("/teams", "POST", {name});

            const uporabnik = await preveriPrijavo();

            document.getElementById("no-team").classList.add("hidden");
            form.classList.add("hidden");

            await prikaziEkipo(uporabnik.teamId, uporabnik.id);

            prikaziSporocilo("Team created successfully!", "success");
        } catch (error) {
            prikaziSporocilo(error.message, "error");
        }
    });
}
function nastaviOdhodIzEkipe() {
    const gumb = document.getElementById("leave-team-button");

    gumb.addEventListener("click", async () => {
        try {
            await apiZahtevek("/teams/leave", "PATCH");
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    });
}

function nastaviPovabila(teamId) {
    const form = document.getElementById("invite-form");
    const message = document.getElementById("invite-message");

    form.onsubmit = async (event) => {
        event.preventDefault();

        const username = document
            .getElementById("invite-username")
            .value.trim();

        try {
            const rezultat = await apiZahtevek(
                "/teams/" + teamId + "/invites",
                "POST",
                {username},
            );

            message.textContent = rezultat.sporocilo;
            message.className = "form-message success";

            form.reset();
        } catch (error) {
            message.textContent = error.message;
            message.className = "form-message error";
        }
    };
}


async function naloziPovabila() {
    const seznam = document.getElementById("invitations-list");

    try {
        const povabila = await apiZahtevek("/teams/invites/my");

        seznam.replaceChildren();

        if (povabila.length === 0) {
            seznam.textContent = "You have no pending invitations.";
            return;
        }

        for (const povabilo of povabila) {
            const element = document.createElement("div");
            element.className = "invitation-item";

            const ime = document.createElement("span");
            ime.textContent = povabilo.teamId?.name || "Unknown team";

            const gumb = document.createElement("button");
            gumb.textContent = "ACCEPT";
            gumb.className = "gold-button";

            gumb.onclick = async () => {
                gumb.disabled = true;

                try {
                    await apiZahtevek(
                        "/teams/invites/" + povabilo._id + "/accept",
                        "PATCH",
                    );

                    window.location.reload();
                } catch (error) {
                    alert(error.message);
                    gumb.disabled = false;
                }
            };

            element.appendChild(ime);
            element.appendChild(gumb);

            seznam.appendChild(element);
        }
    } catch (error) {
        seznam.textContent = error.message;
    }
}

async function naloziProfil(uporabnik) {
    document.getElementById("profile-username").textContent =
        uporabnik.username;

    document.getElementById("profile-email").textContent = uporabnik.email;

    document.getElementById("team-loading").classList.add("hidden");

    if (uporabnik.teamId) {
        try {
            await prikaziEkipo(uporabnik.teamId, uporabnik.id);
        } catch (error) {
            prikaziSporocilo(error.message, "error");
        }
    } else {
        document.getElementById("no-team").classList.remove("hidden");
    }
}

function nastaviOdjavo() {
    document
        .getElementById("logout-button")
        .addEventListener("click", async () => {
            try {
                await apiZahtevek("/auth/logout", "POST");
                window.location.href = "index.html";
            } catch (error) {
                alert(error.message);
            }
        });
}

async function zagon() {
    const uporabnik = await preveriPrijavo();

    if (!uporabnik) return;

    if (document.body.dataset.page === "profile") {
        await naloziProfil(uporabnik);
        await naloziPovabila();

        nastaviUstvarjanjeEkipe();
        nastaviOdhodIzEkipe();
        nastaviOdjavo();
    }
}

zagon();
