// @ts-nocheck
import Submission from "../models/Submission.js";

// 📊 Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Submission.aggregate([
            {
                $group: {
                    _id: "$participantId",
                    totalScore: { $sum: "$scoreAwarded" },
                },
            },
            { $sort: { totalScore: -1 } },
        ]);

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🧑‍💻 All submissions
export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate("participantId", "name email")
            .populate("problemId", "title round");

        res.json(submissions);
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