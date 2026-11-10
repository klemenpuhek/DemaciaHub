const express = require("express");
const router = express.Router();

const {registracija, prijava, preveriPrijavo, odjava} = require("../controllers/authController");

router.post("/register", registracija);
router.post("/login", prijava);
router.get("/me", preveriPrijavo);
router.post("/logout", odjava);

module.exports = router;