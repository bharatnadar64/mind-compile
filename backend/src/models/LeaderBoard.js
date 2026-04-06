import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant"
    },

    totalScore: Number,
    rank: Number,

    roundScores: {
        round1: Number,
        round2: Number,
        round3: Number
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Leaderboard", LeaderboardSchema);
