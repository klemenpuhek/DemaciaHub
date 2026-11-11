const User = require("../models/User");
const Team = require("../models/Team");
const Registration = require("../models/Registration");
const Tournament = require("../models/Tournament")
const mongoose = require("mongoose");

async function ustvariTurnir(req, res) {
    try {
        const {name, description, rules, maxTeams, startDate} = req.body;
        const userId = req.session.userId;

        if (!name?.trim() || !description?.trim() || !rules?.trim()) {
            return res.status(400).json({
                sporocilo: "Izpolnite vsa obvezna polja.",
            });
        }

        if (!Number.isInteger(maxTeams) || maxTeams < 2) {
            return res.status(400).json({
                sporocilo: "Turnir mora omogočati vsaj dve ekipi.",
            });
        }

        const datum = new Date(startDate);

        if (!startDate || isNaN(datum.getTime()) || datum <= new Date()) {
            return res.status(400).json({
                sporocilo: "Datum začetka mora biti v prihodnosti.",
            });
        }

        const turnir = await Tournament.create({
            name: name.trim(),
            description: description.trim(),
            rules: rules.trim(),
            organizerId: userId,
            adminIds: [userId],
            maxTeams,
            startDate: datum,
        });

        return res.status(201).json({
            sporocilo: "Turnir je bil uspešno ustvarjen.",
            turnir,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            sporocilo: error.message,
        });
    }
}

async function pridobiTurnirje(req, res) {
    try {
        const turnirji = await Tournament.find({
            startDate: { $gt: new Date() }
        }).sort({ startDate: 1 });

        return res.json(turnirji);

    } catch (error) {
    console.error(error);

    return res.status(500).json({
        sporocilo: error.message
    });
}
}


async function pridobiTurnir(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                sporocilo: "Neveljaven ID turnirja."
            });
        }

        const turnir = await Tournament.findById(id);

        if (!turnir) {
            return res.status(404).json({
                sporocilo: "Turnir ne obstaja."
            });
        }

        const uporabnik = await User.findById(req.session.userId);
        let prijavljen = false;

        if (uporabnik && uporabnik.teamId) {
            const prijava = await Registration.findOne({
                tournamentId: id,
                teamId: uporabnik.teamId,
                status: { $ne: "rejected" }
            });

            prijavljen = prijava !== null;
        }

        return res.json({ turnir, prijavljen });

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri pridobivanju turnirja."
        });
    }
}


async function prijaviEkipo(req, res) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                sporocilo: "Neveljaven ID turnirja."
            });
        }

        const turnir = await Tournament.findById(id);

        if (!turnir) {
            return res.status(404).json({
                sporocilo: "Turnir ne obstaja."
            });
        }

        if (turnir.startDate <= new Date() || turnir.status !== "upcoming") {
            return res.status(400).json({
                sporocilo: "Prijave na turnir niso več mogoče."
            });
        }

        const uporabnik = await User.findById(userId);

        if (!uporabnik || !uporabnik.teamId) {
            return res.status(400).json({
                sporocilo: "Za prijavo morate biti član ekipe."
            });
        }

        const ekipa = await Team.findById(uporabnik.teamId);

        if (!ekipa) {
            return res.status(404).json({
                sporocilo: "Ekipa ne obstaja."
            });
        }

        if (String(ekipa.captainId) !== String(userId)) {
            return res.status(403).json({
                sporocilo: "Samo kapetan lahko prijavi ekipo."
            });
        }

        const steviloClanov = await User.countDocuments({
            teamId: ekipa._id
        });

        if (steviloClanov !== 5) {
            return res.status(400).json({
                sporocilo: "Ekipa mora imeti natanko 5 igralcev."
            });
        }

        const obstojecaPrijava = await Registration.findOne({
            tournamentId: id,
            teamId: ekipa._id
        });

        if (obstojecaPrijava) {
            return res.status(409).json({
                sporocilo: "Ekipa je že prijavljena na turnir."
            });
        }

        const steviloPrijav = await Registration.countDocuments({
            tournamentId: id,
            status: { $ne: "rejected" }
        });

        if (steviloPrijav >= turnir.maxTeams) {
            return res.status(400).json({
                sporocilo: "Turnir je že zapolnjen."
            });
        }

        const prijava = await Registration.create({
            tournamentId: id,
            teamId: ekipa._id,
            status: "pending"
        });

        return res.status(201).json({
            sporocilo: "Ekipa je bila uspešno prijavljena.",
            prijava
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                sporocilo: "Ekipa je že prijavljena na turnir."
            });
        }

        return res.status(500).json({
            sporocilo: "Napaka pri prijavi ekipe."
        });
    }
}


async function pridobiPrijavljeneEkipe(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                sporocilo: "Neveljaven ID turnirja."
            });
        }

        const prijave = await Registration.find({
            tournamentId: id,
            status: { $ne: "rejected" }
        }).populate("teamId", "name");

        const ekipe = prijave
            .filter(prijava => prijava.teamId)
            .map(prijava => prijava.teamId);

        return res.json(ekipe);

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri pridobivanju ekip."
        });
    }
}


module.exports = {ustvariTurnir, pridobiTurnirje, pridobiTurnir, prijaviEkipo, pridobiPrijavljeneEkipe};
