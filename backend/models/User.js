
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
