// src/models/Problem.js
import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },

    description: { type: String, required: true },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },

    round: { type: Number, required: true, unique: true },

    input: {
        type: [String],   // 👈 ARRAY
        required: true
    },

    expectedOutput: {
        type: [String],   // 👈 ARRAY
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;