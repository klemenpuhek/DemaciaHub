
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    confirmedAt: {
        type: Date,
        default: null
    }
});

registrationSchema.index(
    { tournamentId: 1, teamId: 1 },
    { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
