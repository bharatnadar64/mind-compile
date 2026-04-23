// @ts-nocheck
// src/controllers/problemController.js
import {
    addProblem,
    getAllProblems,
    getProblemByRound,
    updateProblemByRound,
    deleteProblemByRound,
} from "../services/problemService.js";
import Participant from "../models/Participant.js";
import Submission from "../models/Submission.js";

// Add a new problem
export const createProblem = async (req, res) => {
    try {
        const problem = await addProblem(req.body);
        res.status(201).json({ message: "Problem added", problem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all problems
export const listProblems = async (req, res) => {
    try {
        const problems = await getAllProblems();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get problem by ID
export const getProblem = async (req, res) => {
    try {
        const roundNumber = Number(req.params.round);
        const participant = await Participant.findById(req.user.id);
        if (!participant) {
            return res.status(404).json({ error: "Participant not found" });
        }

        const hasUnlockedRound = participant.unlockedRounds.includes(roundNumber);
        if (!hasUnlockedRound) {
            const submissionCount = await Submission.countDocuments({ participantId: participant._id });
            const isFirstRoundAllowed =
                participant.unlockedRounds.length === 0 &&
                submissionCount === 0 &&
                roundNumber === 1;

            if (!isFirstRoundAllowed) {
                return res.status(403).json({ error: "Round is not accessible" });
            }
        }

        const problem = await getProblemByRound(req.params.round);
        res.json(problem);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Update a problem
export const modifyProblem = async (req, res) => {
    try {
        const problem = await updateProblemByRound(req.params.round, req.body);
        res.json({ message: "Problem updated", problem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a problem
export const removeProblem = async (req, res) => {
    try {
        await deleteProblemByRound(req.params.round);
        res.json({ message: "Problem deleted" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};