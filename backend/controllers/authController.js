const User = require("../models/User");
const session = require("express-session");

async function registracija(req, res) {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.json("vsa polja niso izboljnjena");
    }
    if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            sporocilo: "Vsi vnosi morajo biti tipa string.",
        });
    }

    const obsojeci = await User.findOne({
        $or: [{username}, {email}],
    });

    try {
        const uporabnik = new User({
            username,
            email,
            password,
        });

        await uporabnik.save();

        return res
            .status(201)
            .json({sporocilo: "Uporabnik je bil uspesno ustvarjen"});
    } catch (error) {
        return res.status(500).json({sporocilo: error.message});
    }
}

async function prijava(req, res) {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.json({sporocilo: "nistve vnesli vseh podatkov"});
    }
    if (typeof username !== "string" || typeof password !== "string") {
        return res
            .status(500)
            .json({sporocilo: "vneseni podatki niso v pravilnem formatu"});
    }

    try {
        const uporabnik = await User.findOne({
            username,
            password,
        });
        if (!uporabnik) {
            return res.status(401).json({
                sporocilo: "Napačno uporabniško ime ali geslo.",
            });
        }

        req.session.userId = uporabnik._id.toString();
        req.session.save((error) => {
            if (error) {
                return res.status(500).json({
                    sporocilo: "napaka pri shranjevanju v session",
                });
            }
        });

        res.status(200).json({sporocilo: "Prijava je bila uspesna"});
    } catch (error) {
        return res.status(500).json({
            sporocilo: `Prijava ni bila uspesna: ${error.message}`,
        });
    }
}

async function preveriPrijavo(req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                sporocilo: "Uporabnik ni prijavljen."
            });
        }

        const uporabnik = await User.findById(req.session.userId);

        if (!uporabnik) {
            return res.status(404).json({
                sporocilo: "Uporabnik ne obstaja."
            });
        }

        return res.status(200).json({
            sporocilo: "Uporabnik je prijavljen.",
            uporabnik: {
                id: uporabnik._id,
                username: uporabnik.username,
                email: uporabnik.email,
                teamId: uporabnik.teamId
            }
        });

    } catch (error) {
        return res.status(500).json({
            sporocilo: "Napaka pri preverjanju prijave."
        });
    }
}

function odjava(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({
            sporocilo: "Uporabnik ni prijavljen."
        });
    }

    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                sporocilo: "Napaka pri odjavi."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            sporocilo: "Odjava je bila uspešna."
        });
    });
}


module.exports = {registracija, prijava, preveriPrijavo, odjava};
