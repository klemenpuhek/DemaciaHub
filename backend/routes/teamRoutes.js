const express = require("express");
const router = express.Router();

const {
    ustvariEkipo,
    pridobiEkipo,
    povabiIgralca,
    pridobiPovabila,
    sprejmiPovabilo,
    zapustiEkipo
} = require("../controllers/teamController");

const preveriAvtentikacijo = require("../middleware/authMiddleware");

router.get("/invites/my", preveriAvtentikacijo, pridobiPovabila);
router.post("/", preveriAvtentikacijo, ustvariEkipo);
router.get("/:id", preveriAvtentikacijo, pridobiEkipo);
router.post("/:id/invites", preveriAvtentikacijo, povabiIgralca);
router.patch("/invites/:id/accept", preveriAvtentikacijo, sprejmiPovabilo);
router.patch("/leave", preveriAvtentikacijo, zapustiEkipo);

module.exports = router;
