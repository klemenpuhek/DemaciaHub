const express = require("express");
const router = express.Router();

const {
    ustvariTurnir,
    pridobiTurnirje,
    pridobiTurnir,
    prijaviEkipo,
    pridobiPrijavljeneEkipe,
    potrdiPripravljenost
} = require("../controllers/tournamentController");

const preveriAvtentikacijo = require("../middleware/authMiddleware");

router.post("/", preveriAvtentikacijo, ustvariTurnir);
router.get("/", pridobiTurnirje);
router.get("/:id", preveriAvtentikacijo, pridobiTurnir);
router.post("/:id/register", preveriAvtentikacijo, prijaviEkipo);
router.get("/:id/teams", preveriAvtentikacijo, pridobiPrijavljeneEkipe);
router.patch("/:id/lock-in", preveriAvtentikacijo, potrdiPripravljenost);

module.exports = router;