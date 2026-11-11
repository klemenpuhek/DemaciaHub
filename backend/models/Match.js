
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
        required: true
    },
    team1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    team2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    round: {
        type: Number,
        required: true
    },
    matchNumber: {
        type: Number,
        required: true
    },
    winnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    nextMatchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
        default: null
    },
    nextMatchSlot: {
        type: Number,
        enum: [1, 2, null],
        default: null
    }
});

module.exports = mongoose.model("Match", matchSchema);
