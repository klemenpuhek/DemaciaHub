const Tournament = require("../models/Tournament");

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
        return res.status(500).json({
            sporocilo: "Napaka pri pridobivanju turnirjev."
        });
    }
}
module.exports = {ustvariTurnir, pridobiTurnirje};
