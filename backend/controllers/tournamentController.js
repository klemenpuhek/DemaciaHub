const User = require("../models/User");
const Team = require("../models/Team");
const Registration = require("../models/Registration");
const Tournament = require("../models/Tournament");
const Match = require("../models/Match");
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
        const turnirji = await Tournament.find()
            .sort({ startDate: 1 });

        return res.json(turnirji);

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri pridobivanju turnirjev."
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

        let prijavaStatus = null;
        let jeKapetan = false;

        if (uporabnik && uporabnik.teamId) {
            const prijava = await Registration.findOne({
                tournamentId: id,
                teamId: uporabnik.teamId
            });

            const ekipa = await Team.findById(uporabnik.teamId);

            prijavaStatus = prijava ? prijava.status : null;
            jeKapetan = ekipa
                ? String(ekipa.captainId) === String(uporabnik._id)
                : false;
        }

        return res.json({
            turnir,
            prijavaStatus,
            jeKapetan
        });

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri pridobivanju turnirja."
        });
    }
}

async function prijaviEkipo(req, res) {
    try {
        const {id} = req.params;
        const userId = req.session.userId;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                sporocilo: "Neveljaven ID turnirja.",
            });
        }

        const turnir = await Tournament.findById(id);

        if (!turnir) {
            return res.status(404).json({
                sporocilo: "Turnir ne obstaja.",
            });
        }

        const zacetekPripravljanja = new Date(
            turnir.startDate.getTime() - 2 * 60 * 60 * 1000,
        );

        if (
            new Date() >= zacetekPripravljanja ||
            turnir.status !== "upcoming"
        ) {
            return res.status(400).json({
                sporocilo: "Prijave so zaprte 2 uri pred začetkom turnirja.",
            });
        }

        const uporabnik = await User.findById(userId);

        if (!uporabnik || !uporabnik.teamId) {
            return res.status(400).json({
                sporocilo: "Za prijavo morate biti član ekipe.",
            });
        }

        const ekipa = await Team.findById(uporabnik.teamId);

        if (!ekipa) {
            return res.status(404).json({
                sporocilo: "Ekipa ne obstaja.",
            });
        }

        if (String(ekipa.captainId) !== String(userId)) {
            return res.status(403).json({
                sporocilo: "Samo kapetan lahko prijavi ekipo.",
            });
        }

        const steviloClanov = await User.countDocuments({
            teamId: ekipa._id,
        });

        if (steviloClanov !== 5) {
            return res.status(400).json({
                sporocilo: "Ekipa mora imeti natanko 5 igralcev.",
            });
        }

        const obstojecaPrijava = await Registration.findOne({
            tournamentId: id,
            teamId: ekipa._id,
        });

        if (obstojecaPrijava) {
            return res.status(409).json({
                sporocilo: "Ekipa je že prijavljena na turnir.",
            });
        }

        const steviloPrijav = await Registration.countDocuments({
            tournamentId: id,
            status: {$ne: "rejected"},
        });

        if (steviloPrijav >= turnir.maxTeams) {
            return res.status(400).json({
                sporocilo: "Turnir je že zapolnjen.",
            });
        }

        const prijava = await Registration.create({
            tournamentId: id,
            teamId: ekipa._id,
            status: "pending",
        });

        return res.status(201).json({
            sporocilo: "Ekipa je bila uspešno prijavljena.",
            prijava,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                sporocilo: "Ekipa je že prijavljena na turnir.",
            });
        }

        return res.status(500).json({
            sporocilo: "Napaka pri prijavi ekipe.",
        });
    }
}

async function pridobiPrijavljeneEkipe(req, res) {
    try {
        const {id} = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                sporocilo: "Neveljaven ID turnirja.",
            });
        }

        const prijave = await Registration.find({
            tournamentId: id,
            status: {$ne: "rejected"},
        }).populate("teamId", "name");

        const ekipe = prijave
            .filter((prijava) => prijava.teamId)
            .map((prijava) => prijava.teamId);

        return res.json(ekipe);
    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri pridobivanju ekip.",
        });
    }
}

async function potrdiPripravljenost(req, res) {
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

        const zdaj = new Date();
        const zacetek = turnir.startDate;
        const lockInZacetek = new Date(
            zacetek.getTime() - 2 * 60 * 60 * 1000
        );

        if (turnir.status !== "upcoming" ||
            zdaj < lockInZacetek ||
            zdaj >= zacetek) {
            return res.status(400).json({
                sporocilo: "Lock-in je dovoljen samo zadnji 2 uri pred turnirjem."
            });
        }

        const uporabnik = await User.findById(userId);

        if (!uporabnik || !uporabnik.teamId) {
            return res.status(400).json({
                sporocilo: "Niste član ekipe."
            });
        }

        const ekipa = await Team.findById(uporabnik.teamId);

        if (!ekipa || String(ekipa.captainId) !== String(userId)) {
            return res.status(403).json({
                sporocilo: "Samo kapetan lahko potrdi pripravljenost ekipe."
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

        const prijava = await Registration.findOneAndUpdate(
            {
                tournamentId: id,
                teamId: ekipa._id,
                status: "pending"
            },
            {
                status: "confirmed",
                confirmedAt: new Date()
            },
            { new: true }
        );

        if (!prijava) {
            return res.status(409).json({
                sporocilo: "Ekipa ni prijavljena ali je že potrdila sodelovanje."
            });
        }

        return res.json({
            sporocilo: "Ekipa je uspešno potrdila sodelovanje.",
            prijava
        });

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri potrjevanju ekipe."
        });
    }
}

async function pridobiBracket(req, res) {
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

        let dvoboji = await Match.find({ tournamentId: id })
            .sort({ round: 1, matchNumber: 1 })
            .populate("team1Id", "name")
            .populate("team2Id", "name")
            .populate("winnerId", "name");

        if (dvoboji.length > 0) {
            return res.json(dvoboji);
        }

        if (new Date() < turnir.startDate) {
            return res.json([]);
        }

        const prijave = await Registration.find({
            tournamentId: id,
            status: "confirmed"
        });

        const ekipe = prijave.map(prijava => prijava.teamId);

        if (ekipe.length < 2 || ekipe.length > 8) {
            return res.status(400).json({
                sporocilo: "Za bracket potrebujete od 2 do 8 potrjenih ekip."
            });
        }

        for (let i = ekipe.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ekipe[i], ekipe[j]] = [ekipe[j], ekipe[i]];
        }

        const velikost = 2 ** Math.ceil(Math.log2(ekipe.length));
        const steviloKrogov = Math.log2(velikost);
        const steviloBye = velikost - ekipe.length;

        const vsiDvoboji = [];
        const krogi = [];

        for (let krog = 1; krog <= steviloKrogov; krog++) {
            const steviloDvobojev = velikost / (2 ** krog);
            const dvobojiKroga = [];

            for (let i = 0; i < steviloDvobojev; i++) {
                const dvoboj = new Match({
                    tournamentId: id,
                    round: krog,
                    matchNumber: i + 1
                });

                dvobojiKroga.push(dvoboj);
                vsiDvoboji.push(dvoboj);
            }

            krogi.push(dvobojiKroga);
        }

        for (let krog = 0; krog < krogi.length - 1; krog++) {
            for (let i = 0; i < krogi[krog].length; i++) {
                krogi[krog][i].nextMatchId = krogi[krog + 1][Math.floor(i / 2)]._id;
                krogi[krog][i].nextMatchSlot = (i % 2) + 1;
            }
        }

        let indeksEkipe = 0;

        for (let i = 0; i < krogi[0].length; i++) {
            const dvoboj = krogi[0][i];

            dvoboj.team1Id = ekipe[indeksEkipe++];

            if (i < steviloBye) {
                dvoboj.winnerId = dvoboj.team1Id;
                dvoboj.status = "completed";

                if (dvoboj.nextMatchId) {
                    const naslednji = krogi[1][Math.floor(i / 2)];

                    if (dvoboj.nextMatchSlot === 1) {
                        naslednji.team1Id = dvoboj.team1Id;
                    } else {
                        naslednji.team2Id = dvoboj.team1Id;
                    }
                }
            } else {
                dvoboj.team2Id = ekipe[indeksEkipe++];
            }
        }

        await Match.insertMany(vsiDvoboji);

        dvoboji = await Match.find({ tournamentId: id })
            .sort({ round: 1, matchNumber: 1 })
            .populate("team1Id", "name")
            .populate("team2Id", "name")
            .populate("winnerId", "name");

        return res.json(dvoboji);

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri generiranju bracketa."
        });
    }
}


module.exports = {
    ustvariTurnir,
    pridobiTurnirje,
    pridobiTurnir,
    prijaviEkipo,
    pridobiPrijavljeneEkipe,
    potrdiPripravljenost,
    pridobiBracket
};
