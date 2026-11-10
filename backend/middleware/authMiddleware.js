function preveriAvtentikacijo(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            sporocilo: "Za uporabo te funkcije morate biti prijavljeni."
        });
    }

    next();
}

module.exports = preveriAvtentikacijo;
