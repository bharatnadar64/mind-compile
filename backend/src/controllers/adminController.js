// @ts-nocheck
import Submission from "../models/Submission.js";
import Leaderboard from "../models/LeaderBoard.js";
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
            participantId: s.participantId?._id,
            name: s.participantId?.name,
            email: s.participantId?.email,
            problemTitle: s.problemId?.title,
            round: s.problemId?.round,
            code: s.code,
            scoreAwarded: s.scoreAwarded,
            bonus5Awarded: s.bonus5Awarded || false,
            bonus2Awarded: s.bonus2Awarded || false,
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

        if (submission.scoreAwarded <= 0) {
            return res.status(400).json({ message: "Bonus can only be awarded to a correct submission with non-zero score." });
        }

        let bonusField;
        if (points === 5) {
            bonusField = "bonus5Awarded";
        } else if (points === 2) {
            bonusField = "bonus2Awarded";
        } else {
            return res.status(400).json({ message: "Unsupported bonus value." });
        }

        const existingBonus = await Submission.findOne({
            participantId: submission.participantId,
            round: submission.round,
            [bonusField]: true,
        });

        if (existingBonus) {
            return res.status(400).json({ message: `The ${points}-point bonus was already granted for this user in this round.` });
        }

        if (submission[bonusField]) {
            return res.status(400).json({ message: `This submission already has the ${points}-point bonus.` });
        }

        submission.scoreAwarded += points;
        submission[bonusField] = true;

        let leaderboard = await Leaderboard.findOne({ participantId: submission.participantId });
        if (!leaderboard) {
            leaderboard = await Leaderboard.create({
                participantId: submission.participantId,
                totalScore: 0,
                roundScores: {
                    round1: 0,
                    round2: 0,
                    round3: 0,
                },
            });
        }

        if (submission.round === 1.1 || submission.round === 1.2) {
            leaderboard.roundScores.round1 += points;
        } else if (submission.round === 2) {
            leaderboard.roundScores.round2 += points;
        } else if (submission.round === 3) {
            leaderboard.roundScores.round3 += points;
        }

        leaderboard.totalScore =
            (leaderboard.roundScores.round1 || 0) +
            (leaderboard.roundScores.round2 || 0) +
            (leaderboard.roundScores.round3 || 0);
        leaderboard.lastUpdated = new Date();

        await Promise.all([submission.save(), leaderboard.save()]);

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