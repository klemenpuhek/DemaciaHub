require("dotenv").config();
const express = require("express");
const cors = require("cors");
const povezavaBaza = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

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

app.get("/", (req,res)=>{

    res.json({sporocilo: "DemaciaHub api deluje"})

});

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tournaments", tournamentRoutes);

async function zagon(){
    try{
        await povezavaBaza();

        app.listen(PORT, ()=>{
            console.log(`streznik deluje na ${PORT}`)
        });

    }catch(error){
        console.log(`Zagon streznika ni uspel ${error.message}`);
    }
}

zagon();