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
        default: ""
    },

    output: {
        type: String,
        default: ""
    },

    isCorrect: {
        type: Boolean,
        default: false
    },

    scoreAwarded: {
        type: Number,
        default: 0
    },

    bonus5Awarded: {
        type: Boolean,
        default: false
    },

    bonus2Awarded: {
        type: Boolean,
        default: false
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