const express = require("express");
const router = express.Router();

const {
    ustvariTurnir,
    pridobiTurnirje
} = require("../controllers/tournamentController");

const preveriAvtentikacijo = require("../middleware/authMiddleware");

router.post("/", preveriAvtentikacijo, ustvariTurnir);
router.get("/", pridobiTurnirje);

module.exports = router;