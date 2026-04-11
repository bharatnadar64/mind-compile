// @ts-nocheck
// src/controllers/submissionController.js
import {
    submitSolution,
    getAllSubmissions,
    getSubmissionsByParticipant,
    getSubmissionsByProblem,
    updateSubmissionResult
} from "../services/submissionService.js";

/**
 * Submit a new solution
 */
export const submitSolutionController = async (req, res) => {
    try {
        const submission = await submitSolution({
            ...req.body,
            participantId: req.user.id // ✅ FROM TOKEN
        });
        res.status(201).json({ submission });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
/**
 * Get all submissions
 */
export const getAllSubmissionsController = async (req, res) => {
    try {
        const submissions = await getAllSubmissions();
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/*
 * Get submissions by participant
 */
export const getSubmissionsByParticipantController = async (req, res) => {
    try {
        const { participantId } = req.params;
        const submissions = await getSubmissionsByParticipant(participantId);
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get submissions by problem
 */
export const getSubmissionsByProblemController = async (req, res) => {
    try {
        const { problemId } = req.params;
        const submissions = await getSubmissionsByProblem(problemId);
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update submission result (isCorrect + scoreAwarded)
 */
export const updateSubmissionResultController = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { isCorrect, score } = req.body;

        if (typeof isCorrect !== "boolean")
            return res.status(400).json({ error: "isCorrect must be boolean" });

        const numericScore = Number(score) || 0;
        const updatedSubmission = await updateSubmissionResult(submissionId, isCorrect, numericScore);

        res.json({ message: "Submission updated successfully", submission: updatedSubmission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};