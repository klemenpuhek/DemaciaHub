const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rules: {
        type: String,
        required: true
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    adminIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    maxTeams: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "upcoming"
    }
});

module.exports = mongoose.model("Tournament", tournamentSchema);
