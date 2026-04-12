import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant"
    },

    totalScore: Number,
    rank: Number,

    roundScores: {
        round1: { type: Number, default: 0 },
        round2: { type: Number, default: 0 },
        round3: { type: Number, default: 0 }
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Leaderboard ||
    mongoose.model("Leaderboard", LeaderboardSchema);