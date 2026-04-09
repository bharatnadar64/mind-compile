// src/models/Submission.js
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        required: true
    },

    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },

    round: {
        type: Number,
        required: true
    },

    code: {
        type: String,
        required: true
    },

    output: {
        type: String,
        required: true
    },

    isCorrect: {
        type: Boolean,
        default: false
    },

    scoreAwarded: {
        type: Number,
        default: 0
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Submission = mongoose.model("Submission", SubmissionSchema);

// Export as default for easy import
export default Submission;