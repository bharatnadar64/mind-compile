import mongoose from "mongoose";

const RoundSchema = new mongoose.Schema({
    roundNumber: { type: Number, required: true, unique: true },

    name: String, // "Warm-Up", "Core", "Final"

    timeLimit: Number, // in minutes

    executionAllowed: Boolean,
    maxExecutions: Number, // 0 or 1

    baseScore: Number, // 10, 20, 30

    bonusFirst: { type: Number, default: 5 },
    bonusCleanCode: { type: Number, default: 2 }
});

export default mongoose.model("Round", RoundSchema);