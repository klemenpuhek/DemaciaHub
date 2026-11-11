const express = require("express");
const router = express.Router();

const {
    ustvariTurnir,
    pridobiTurnirje,
    pridobiTurnir,
    prijaviEkipo,
    pridobiPrijavljeneEkipe,
    potrdiPripravljenost,
    pridobiBracket,
    vnesiRezultat
} = require("../controllers/tournamentController");

const preveriAvtentikacijo = require("../middleware/authMiddleware");

router.post("/", preveriAvtentikacijo, ustvariTurnir);
router.get("/", pridobiTurnirje);
router.get("/:id", preveriAvtentikacijo, pridobiTurnir);
router.post("/:id/register", preveriAvtentikacijo, prijaviEkipo);
router.get("/:id/teams", preveriAvtentikacijo, pridobiPrijavljeneEkipe);
router.patch("/:id/lock-in", preveriAvtentikacijo, potrdiPripravljenost);
router.get("/:id/bracket", preveriAvtentikacijo, pridobiBracket);
router.patch("/:id/matches/:matchId/result",preveriAvtentikacijo, vnesiRezultat);

module.exports = router;