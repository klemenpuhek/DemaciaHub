require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");

const povezavaBaza = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tournaments", tournamentRoutes);

app.use(express.static(path.join(__dirname, "../frontend")));

async function zagon() {
    try {
        await povezavaBaza();

        app.listen(PORT, () => {
            console.log(`Streznik deluje na http://localhost:${PORT}`);
        });

    } catch (error) {
        console.log(`Zagon streznika ni uspel: ${error.message}`);
    }
}

zagon();
