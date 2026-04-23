// @ts-nocheck
import mongoose from "mongoose";
import Round from "../models/RoundConfig.js";
import Participant from "../models/Participant.js";
import Submission from "../models/Submission.js";
import {
    createRound,
    getAllRounds,
    getRoundById,
    updateRound,
    deleteRound
} from "../services/roundService.js";

// ➕ Create Round
export const createRoundController = async (req, res) => {
    try {
        const round = await createRound(req.body);
        res.status(201).json(round);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Round already exists" });
        }
        res.status(500).json({ error: err.message });
    }
};

// 📥 Get All Rounds
export const getAllRoundsController = async (req, res) => {
    try {
        const rounds = await getAllRounds();
        const participant = await Participant.findById(req.user.id);
        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        // Ensure at least first round is unlocked only for participants who have never submitted.
        if (participant.unlockedRounds.length === 0 && rounds.length > 0) {
            const submissionCount = await Submission.countDocuments({ participantId: participant._id });
            if (submissionCount === 0) {
                participant.unlockedRounds.push(rounds[0].roundNumber);
                await participant.save();
            }
        }
        const formatted = rounds.map((r) => ({
            ...r.toObject(),
            unlocked: participant.unlockedRounds.includes(r.roundNumber),
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔓 Unlock Next Round
export const unlockNextRoundController = async (req, res) => {
    try {
        const { currentRound } = req.body;
        const participant = await Participant.findById(req.user.id);
        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }
        const rounds = await getAllRounds();
        const currentIndex = rounds.findIndex(r => r.roundNumber === currentRound);
        if (currentIndex === -1) {
            return res.status(400).json({ message: "Round not found" });
        }

        const nextRoundNumber = rounds[currentIndex + 1]?.roundNumber;

        // Lock current round in all cases
        participant.unlockedRounds = participant.unlockedRounds.filter(r => r !== currentRound);

        if (nextRoundNumber !== undefined) {
            // Unlock next round if one exists
            if (!participant.unlockedRounds.includes(nextRoundNumber)) {
                participant.unlockedRounds.push(nextRoundNumber);
            }
            await participant.save();
            res.json({ message: "Next round unlocked", unlockedRounds: participant.unlockedRounds });
        } else {
            // Last round submitted: lock the current round and keep no next round
            await participant.save();
            res.json({ message: "Last round locked", unlockedRounds: participant.unlockedRounds });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔍 Get One Round
export const getRoundByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        let round;

        if (mongoose.Types.ObjectId.isValid(id)) {
            round = await getRoundById(id);
        } else {
            // Try as roundNumber
            round = await Round.findOne({ roundNumber: Number(id) });
        }

        if (!round) return res.status(404).json({ message: "Round not found" });
        res.json(round);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✏️ Update Round
export const updateRoundController = async (req, res) => {
    try {
        const round = await updateRound(req.params.id, req.body);
        if (!round) return res.status(404).json({ message: "Round not found" });
        res.json(round);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ❌ Delete Round
export const deleteRoundController = async (req, res) => {
    try {
        const round = await deleteRound(req.params.id);
        if (!round) return res.status(404).json({ message: "Round not found" });
        res.json({ message: "Round deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// GET /api/rounds/number/:roundNumber
export const getRoundByNumberController = async (req, res) => {
    try {
        const round = await Round.findOne({ roundNumber: Number(req.params.roundNumber) });
        if (!round) return res.status(404).json({ error: "Round not found" });
        res.json(round);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
