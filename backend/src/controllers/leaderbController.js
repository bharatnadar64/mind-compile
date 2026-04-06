// @ts-nocheck
import {
    createEntry,
    getLeaderboard,
    getEntryByParticipant,
    updateEntry,
    deleteEntry
} from "../services/leaderboardService.js";

// ➕ Create Entry
export const createEntryController = async (req, res) => {
    try {
        const entry = await createEntry(req.body);
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📊 Get Leaderboard
export const getLeaderboardController = async (req, res) => {
    try {
        const leaderboard = await getLeaderboard();
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔍 Get Single Entry
export const getEntryByParticipantController = async (req, res) => {
    try {
        const entry = await getEntryByParticipant(req.params.participantId);
        if (!entry) return res.status(404).json({ message: "Entry not found" });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✏️ Update Entry
export const updateEntryController = async (req, res) => {
    try {
        const entry = await updateEntry(req.params.participantId, req.body);
        if (!entry) return res.status(404).json({ message: "Entry not found" });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ❌ Delete Entry
export const deleteEntryController = async (req, res) => {
    try {
        const entry = await deleteEntry(req.params.participantId);
        if (!entry) return res.status(404).json({ message: "Entry not found" });
        res.json({ message: "Entry deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};