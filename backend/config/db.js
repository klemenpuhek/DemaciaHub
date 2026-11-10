const mongoose = require("mongoose");

async function povezavaBaza() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Povezava z bazo deluje");
    } catch (napaka) {
        console.error("napaka pri povezavi z bazo:", napaka.message);
        throw napaka;
    }
}

module.exports = povezavaBaza;