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
    round: { type: Number, required: true, unique: true }, // 1.1, 1.2, 2, 3
    expectedOutput: { type: String, required: true }, // could be JSON string if needed
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const Problem = mongoose.model("Problem", ProblemSchema);

// Export as default for easy import
export default Problem;