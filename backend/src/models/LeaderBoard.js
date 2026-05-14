import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant"
    },

    totalScore: Number,
    rank: Number,

    roundScores: {
        type: Map,
        of: Number,
        default: {}
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Leaderboard ||
    mongoose.model("Leaderboard", LeaderboardSchema);