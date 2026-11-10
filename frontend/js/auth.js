const API_URL = "http://127.0.0.1:3000/api/auth";

const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const formMessage = document.getElementById("form-message");

function prikaziSporocilo(sporocilo, tip) {
    formMessage.textContent = sporocilo;
    formMessage.className = `form-message ${tip}`;
}

function pocistiSporocilo() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

function prikaziObrazec(tip) {
    const jePrijava = tip === "login";

    loginForm.classList.toggle("hidden", !jePrijava);
    registerForm.classList.toggle("hidden", jePrijava);

    loginTab.classList.toggle("active", jePrijava);
    registerTab.classList.toggle("active", !jePrijava);

    formTitle.textContent = jePrijava
        ? "Welcome back"
        : "Join DemaciaHub";

    formSubtitle.textContent = jePrijava
        ? "Sign in to continue your journey."
        : "Create your account and join the arena.";

    pocistiSporocilo();
}

loginTab.addEventListener("click", () => {
    prikaziObrazec("login");
});

registerTab.addEventListener("click", () => {
    prikaziObrazec("register");
});

async function posljiZahtevek(pot, podatki) {
    const odgovor = await fetch(`${API_URL}/${pot}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(podatki)
    });

    const rezultat = await odgovor.json();

    if (!odgovor.ok) {
        throw new Error(
            rezultat.sporocilo || "Prišlo je do napake."
        );
    }

    return rezultat;
}

// Registracija
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document
        .getElementById("register-username").value.trim();

    const email = document
        .getElementById("register-email").value.trim();

    const password = document
        .getElementById("register-password").value;

    const gumb = registerForm.querySelector(".submit-btn");
    gumb.disabled = true;

    try {
        const rezultat = await posljiZahtevek("register", {
            username,
            email,
            password
        });

        prikaziObrazec("login");

        document.getElementById("login-username").value = username;

        prikaziSporocilo(
            rezultat.sporocilo || "Registration successful!",
            "success"
        );

        registerForm.reset();

    } catch (error) {
        prikaziSporocilo(error.message, "error");
    } finally {
        gumb.disabled = false;
    }
});

// Prijava
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document
        .getElementById("login-username").value.trim();

    const password = document
        .getElementById("login-password").value;

    const gumb = loginForm.querySelector(".submit-btn");
    gumb.disabled = true;

    try {
        const rezultat = await posljiZahtevek("login", {
            username,
            password
        });

        prikaziSporocilo(
            rezultat.sporocilo || "Login successful!",
            "success"
        );

        loginForm.reset();

        window.location.href = "home.html";

    } catch (error) {
        prikaziSporocilo(error.message, "error");
    } finally {
        gumb.disabled = false;
    }
});
