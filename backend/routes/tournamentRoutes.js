const express = require("express");
const router = express.Router();

const {
    ustvariTurnir,
    pridobiTurnirje,
    pridobiTurnir,
    prijaviEkipo,
    pridobiPrijavljeneEkipe
} = require("../controllers/tournamentController");

const preveriAvtentikacijo = require("../middleware/authMiddleware");

router.post("/", preveriAvtentikacijo, ustvariTurnir);
router.get("/", pridobiTurnirje);
router.get("/:id", preveriAvtentikacijo, pridobiTurnir);
router.post("/:id/register", preveriAvtentikacijo, prijaviEkipo);
router.get("/:id/teams", preveriAvtentikacijo, pridobiPrijavljeneEkipe);

module.exports = router;