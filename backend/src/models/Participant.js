import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const ParticipantSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    college: String,

    totalScore: {
        type: Number,
        default: 0
    },

    unlockedRounds: {
        type: [Number],
        default: [] // Will be set to first round on first load
    },

    // Optional but useful
    isAdmin: {
        type: Boolean,
        default: false
    },

    isDisqualified: {
        type: Boolean,
        default: false
    },

    disqualifiedRounds: {
        type: [Number],
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Participant = mongoose.model("Participant", ParticipantSchema)
export default Participant