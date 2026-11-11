require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Team = require("./models/Team");
const Registration = require("./models/Registration");
const Tournament = require("./models/Tournament");

async function napolniBazo() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const tournamentId = process.argv[2];

        if (!mongoose.isValidObjectId(tournamentId)) {
            throw new Error("Vnesi veljaven ID turnirja.");
        }

        const turnir = await Tournament.findById(tournamentId);

        if (!turnir) {
            throw new Error("Turnir ne obstaja.");
        }

        const steviloPrijav = await Registration.countDocuments({
            tournamentId,
            status: { $ne: "rejected" }
        });

        if (steviloPrijav + 8 > turnir.maxTeams) {
            throw new Error("Turnir nima prostora za 8 dodatnih ekip.");
        }

        for (let i = 1; i <= 8; i++) {
            const imeEkipe = `Seed Team ${i}`;

            const obstojecaEkipa = await Team.findOne({
                name: imeEkipe
            });

            if (obstojecaEkipa) {
                throw new Error(`Ekipa ${imeEkipe} že obstaja.`);
            }

            for (let j = 1; j <= 5; j++) {
                const username = `seed_${i}_${j}`;
                const obstojeciUporabnik = await User.findOne({ username });

                if (obstojeciUporabnik) {
                    throw new Error(`Uporabnik ${username} že obstaja.`);
                }
            }
        }

        for (let i = 1; i <= 8; i++) {
            const igralci = [];

            for (let j = 1; j <= 5; j++) {
                const uporabnik = await User.create({
                    username: `seed_${i}_${j}`,
                    email: `seed_${i}_${j}@example.com`,
                    password: "test123"
                });

                igralci.push(uporabnik);
            }

            const ekipa = await Team.create({
                name: `Seed Team ${i}`,
                captainId: igralci[0]._id
            });

            await User.updateMany(
                { _id: { $in: igralci.map(igralec => igralec._id) } },
                { $set: { teamId: ekipa._id } }
            );

            await Registration.create({
                tournamentId: turnir._id,
                teamId: ekipa._id,
                status: "confirmed",
                registeredAt: new Date(),
                confirmedAt: new Date()
            });

            console.log(`Ustvarjena ekipa: ${ekipa.name}`);
        }

        console.log("Uspešno ustvarjenih 8 ekip in 40 uporabnikov.");

    } catch (error) {
        console.error("Napaka:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

napolniBazo();
