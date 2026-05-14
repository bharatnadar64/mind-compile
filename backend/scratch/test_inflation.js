// @ts-nocheck
import mongoose from "mongoose";
import dotenv from "dotenv";
import { submitSolution } from "../src/services/submissionService.js";
import Leaderboard from "../src/models/LeaderBoard.js";
import Submission from "../src/models/Submission.js";

dotenv.config();

const participantId = "69da85dafc1e7b7d286bb521";
const problemId = "69d7ef5824272ecf1b14378a";
const round = 1.1;

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Reset state
        await Leaderboard.deleteOne({ participantId });
        await Submission.deleteMany({ participantId, problemId });
        console.log("State reset for test participant");

        // 2. First submission (Correct)
        console.log("Submitting first time (correct)...");
        const code = "import sys\nfor line in sys.stdin:\n    if line.strip():\n        a, b = map(int, line.split())\n        print(a + b)";
        await submitSolution({
            participantId,
            problemId,
            round,
            code, 
            language: "python-3.14",
            startedAt: new Date(),
            submittedAt: new Date()
        });

        let lb = await Leaderboard.findOne({ participantId });
        console.log("Score after 1st submission:", lb.totalScore);

        // 3. Second submission (Correct)
        console.log("Submitting second time (correct)...");
        await submitSolution({
            participantId,
            problemId,
            round,
            code, 
            language: "python-3.14",
            startedAt: new Date(),
            submittedAt: new Date()
        });

        lb = await Leaderboard.findOne({ participantId });
        console.log("Score after 2nd submission:", lb.totalScore);

        if (lb.totalScore === 10) {
            console.log("✅ TEST PASSED: Points did not inflate.");
        } else {
            console.log("❌ TEST FAILED: Points inflated to", lb.totalScore);
        }

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err);
        process.exit(1);
    }
};

runTest();
