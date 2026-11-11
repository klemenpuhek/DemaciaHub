const API_URL = "/api";

const form = document.getElementById("tournament-form");
const message = document.getElementById("tournament-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const podatki = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        rules: document.getElementById("rules").value.trim(),
        maxTeams: Number(document.getElementById("maxTeams").value),
        startDate: document.getElementById("startDate").value
    };

    try {
        const odgovor = await fetch(API_URL + "/tournaments", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(podatki)
        });

        const rezultat = await odgovor.json();

        if (!odgovor.ok) {
            throw new Error(rezultat.sporocilo);
        }

        message.textContent = "Tournament created successfully!";
        message.className = "form-message success";
        form.reset();

    } catch (error) {
        message.textContent = error.message;
        message.className = "form-message error";
    }
});
