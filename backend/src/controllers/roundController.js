// @ts-nocheck
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
        res.json(rounds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔍 Get One Round
export const getRoundByIdController = async (req, res) => {
    try {
        const round = await getRoundById(req.params.id);
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