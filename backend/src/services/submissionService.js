// @ts-nocheck
import Submission from "../models/Submission.js";
import Problem from "../models/Problems.js";
import { executeCode } from "./codeService.js"

/**
 * 🔍 Compare outputs safely
 */
const isMatch = (userOutput, expectedOutput) => {
    return userOutput?.trim() === expectedOutput?.trim();
};

/**
 * 🧠 Calculate score based on round
 */
const calculateScore = (round, isCorrect) => {
    if (!isCorrect) return 0;

    if (round === 1 || round === 1.1 || round === 1.2) return 10;
    if (round === 2) return 20;
    if (round === 3) return 30;

    return 0;
};

/**
 * 🚀 Submit Solution (MAIN LOGIC)
 */
export const submitSolutionController = async (req, res) => {
    try {
        const participantId = req.user.id; // ✅ from JWT
        const { problemId, round, code, language, startedAt } = req.body;

        if (!problemId || !round || !code || !language) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const submission = await submitSolution({
            participantId,
            problemId,
            round,
            code,
            language,
            startedAt,
            submittedAt: new Date()
        });

        res.status(201).json({
            message: "Submission successful",
            submission
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * 📥 Get all submissions
 */
export const getAllSubmissions = async () => {
    return await Submission.find()
        .populate("participantId", "name email")
        .populate("problemId", "title difficulty round")
        .sort({ submittedAt: -1 });
};

/**
 * 👤 Get submissions by participant
 */
export const getSubmissionsByParticipant = async (participantId) => {
    return await Submission.find({ participantId })
        .populate("problemId", "title difficulty round")
        .sort({ submittedAt: -1 });
};

/**
 * 📊 Get submissions by problem
 */
export const getSubmissionsByProblem = async (problemId) => {
    return await Submission.find({ problemId })
        .populate("participantId", "name email")
        .sort({ submittedAt: -1 });
};

/**
 * ✏️ Update submission result manually (admin use)
 */
export const updateSubmissionResult = async (submissionId, isCorrect, score) => {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error("Submission not found");

    submission.isCorrect = isCorrect;
    submission.scoreAwarded = isCorrect ? score : 0;

    return await submission.save();
};