// @ts-nocheck
import Submission from "../models/Submission.js";
import { getLeaderboard } from "../services/leaderboardService.js";
import { getAllSubmissions as getAllSubmissionsService } from "../services/submissionService.js";
import Participant from "../models/Participant.js";
import bcrypt from "bcryptjs";

// 📊 Leaderboard
export const getLeaderboardController = async (req, res) => {
    try {
        const data = await getLeaderboard();

        // ✅ reshape response
        const formatted = data.map((item) => ({
            participantId: item.participantId._id,
            name: item.participantId.name,
            email: item.participantId.email,
            college: item.participantId.college,
            totalScore: item.totalScore,
            rank: item.rank,
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🧑‍💻 All submissions
// controllers/adminController.js


export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await getAllSubmissionsService();

        // ✅ Optional: flatten response (recommended)
        const formatted = submissions.map((s) => ({
            _id: s._id,
            name: s.participantId?.name,
            email: s.participantId?.email,
            problemTitle: s.problemId?.title,
            round: s.problemId?.round,
            code: s.code,
            scoreAwarded: s.scoreAwarded,
            submittedAt: s.submittedAt,
        }));

        res.json(formatted);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🎯 Bonus points
export const giveBonusPoints = async (req, res) => {
    try {
        const { points } = req.body;

        const submission = await Submission.findById(req.params.submissionId);
        if (!submission) return res.status(404).json({ message: "Not found" });

        submission.scoreAwarded += points;

        await submission.save();

        res.json({ message: "Bonus added", submission });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await Participant.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const { name, email, college, isAdmin } = req.body;

        const updated = await Participant.findByIdAndUpdate(
            req.params.userId,
            { name, email, college, isAdmin },
            { new: true }
        ).select("-password");

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 DELETE USER
export const deleteUser = async (req, res) => {
    try {
        await Participant.findByIdAndDelete(req.params.userId);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};