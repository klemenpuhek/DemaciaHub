const User = require("../models/User");
const Team = require("../models/Team");
const TeamInvite = require("../models/TeamInvite");

async function ustvariEkipo(req, res) {
    try {
        const {name} = req.body;
        const userId = req.session.userId;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                sporocilo: "Ime ekipe mora biti izpolnjeno.",
            });
        }

        const uporabnik = await User.findById(userId);

        if (!uporabnik) {
            return res.status(404).json({
                sporocilo: "Uporabnik ne obstaja.",
            });
        }

        if (uporabnik.teamId) {
            return res.status(409).json({
                sporocilo: "Uporabnik je že član ekipe.",
            });
        }

        const ekipa = new Team({
            name: name.trim(),
            captainId: uporabnik._id,
        });

        await ekipa.save();

        uporabnik.teamId = ekipa._id;
        await uporabnik.save();

        return res.status(201).json({
            sporocilo: "Ekipa je bila uspešno ustvarjena.",
            ekipa,
        });
    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri ustvarjanju ekipe.",
        });
    }
}

async function pridobiEkipo(req, res) {
    try {
        const {id} = req.params;

        const ekipa = await Team.findById(id);

        if (!ekipa) {
            return res.status(404).json({
                sporocilo: "Ekipa ne obstaja",
            });
        }

        const clani = await User.find({teamId: ekipa._id}).select(
            "username email",
        );

        return res.json({
            ekipa,
            clani,
        });

    } catch (error) {
        return res.status(500).json({sporocilo: error.message});
    }
}

async function povabiIgralca(req, res) {
    try {
        const { id } = req.params;
        const { username } = req.body;
        const userId = req.session.userId;

        if (typeof username !== "string" || !username.trim()) {
            return res.status(400).json({
                sporocilo: "Vnesite uporabniško ime igralca."
            });
        }

        const ekipa = await Team.findById(id);

        if (!ekipa) {
            return res.status(404).json({
                sporocilo: "Ekipa ne obstaja."
            });
        }

        if (ekipa.captainId.toString() !== userId) {
            return res.status(403).json({
                sporocilo: "Samo kapetan lahko pošilja povabila."
            });
        }

        const uporabnik = await User.findOne({
            username: username.trim()
        });

        if (!uporabnik) {
            return res.status(404).json({
                sporocilo: "Uporabnik ne obstaja."
            });
        }

        if (uporabnik.teamId) {
            return res.status(409).json({
                sporocilo: "Uporabnik je že član ekipe."
            });
        }

        const obstojecePovabilo = await TeamInvite.findOne({
            teamId: ekipa._id,
            userId: uporabnik._id,
            status: "pending"
        });

        if (obstojecePovabilo) {
            return res.status(409).json({
                sporocilo: "Igralec že ima čakajoče povabilo."
            });
        }

        const povabilo = await TeamInvite.create({
            teamId: ekipa._id,
            userId: uporabnik._id
        });

        return res.status(201).json({
            sporocilo: "Povabilo je bilo uspešno poslano.",
            povabilo
        });

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri pošiljanju povabila."
        });
    }
}

async function pridobiPovabila(req, res) {
    try {
        const povabila = await TeamInvite.find({
            userId: req.session.userId,
            status: "pending"
        }).populate("teamId", "name");

        return res.json(povabila);

    } catch (error) {
        return res.status(500).json({
            sporocilo: error.message
        });
    }
}

async function sprejmiPovabilo(req, res) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        const povabilo = await TeamInvite.findOne({
            _id: id,
            userId,
            status: "pending"
        });

        if (!povabilo) {
            return res.status(404).json({
                sporocilo: "Povabilo ne obstaja."
            });
        }

        const uporabnik = await User.findById(userId);

        if (!uporabnik || uporabnik.teamId) {
            return res.status(409).json({
                sporocilo: "Uporabnik je že član ekipe ali ne obstaja."
            });
        }

        const ekipa = await Team.findById(povabilo.teamId);

        if (!ekipa) {
            return res.status(404).json({
                sporocilo: "Ekipa ne obstaja."
            });
        }

        uporabnik.teamId = ekipa._id;
        await uporabnik.save();

        povabilo.status = "accepted";
        await povabilo.save();

        await TeamInvite.updateMany(
            { userId, status: "pending" },
            { $set: { status: "rejected" } }
        );

        return res.json({
            sporocilo: "Uspešno ste se pridružili ekipi."
        });

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri sprejemanju povabila."
        });
    }
}

async function zapustiEkipo(req, res) {
    try {
        const userId = req.session.userId;
        const uporabnik = await User.findById(userId);

        if (!uporabnik || !uporabnik.teamId) {
            return res.status(400).json({
                sporocilo: "Uporabnik ni član ekipe."
            });
        }

        const ekipa = await Team.findById(uporabnik.teamId);

        if (ekipa && ekipa.captainId.toString() === userId) {
            return res.status(403).json({
                sporocilo: "Kapetan ne more zapustiti ekipe."
            });
        }

        uporabnik.teamId = null;
        await uporabnik.save();

        return res.json({
            sporocilo: "Uspešno ste zapustili ekipo."
        });

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri zapuščanju ekipe."
        });
    }
}
module.exports = {ustvariEkipo, pridobiEkipo, povabiIgralca, pridobiPovabila, sprejmiPovabilo,zapustiEkipo};
