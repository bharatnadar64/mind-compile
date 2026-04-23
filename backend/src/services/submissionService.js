// @ts-nocheck
import Submission from "../models/Submission.js";
import Participant from "../models/Participant.js";
import Problem from "../models/Problems.js";
import { executeCode } from "./codeService.js"
import Leaderboard from "../models/LeaderBoard.js";

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

export const submitSolution = async ({
    participantId,
    problemId,
    round,
    code,
    language,
    startedAt,
    submittedAt
}) => {

    // ✅ Check required fields (code can be empty, but others are required)
    if (!participantId || !problemId || !round || !language) {
        throw new Error("Missing required fields");
    }

    const participant = await Participant.findById(participantId);
    if (!participant) {
        throw new Error("Participant not found");
    }

    const hasUnlockedRound = participant.unlockedRounds.includes(round);
    if (!hasUnlockedRound) {
        const submissionCount = await Submission.countDocuments({ participantId });
        const isFirstRoundAllowed =
            participant.unlockedRounds.length === 0 &&
            submissionCount === 0 &&
            round === 1;

        if (!isFirstRoundAllowed) {
            throw new Error("Round is not accessible");
        }
    }

    // 1️⃣ Fetch problem
    const problem = await Problem.findById(problemId);
    if (!problem) throw new Error("Problem not found");

    const inputs = problem.input;
    const expectedOutputs = problem.expectedOutput;

    if (!inputs || !expectedOutputs || inputs.length !== expectedOutputs.length) {
        throw new Error("Invalid test cases");
    }

    // 🔴 If code is empty/whitespace, mark as incorrect and award 0 points
    const trimmedCode = code?.trim() || "";
    if (!trimmedCode) {
        const submission = await Submission.create({
            participantId,
            problemId,
            round,
            code: "",
            output: JSON.stringify([]),
            isCorrect: false,
            scoreAwarded: 0,
            startedAt: startedAt ? new Date(startedAt) : new Date(),
            submittedAt: submittedAt ? new Date(submittedAt) : new Date()
        });

        // ============================
        // 🏆 LEADERBOARD LOGIC (0 points)
        // ============================

        let leaderboard = await Leaderboard.findOne({ participantId });

        if (!leaderboard) {
            leaderboard = await Leaderboard.create({
                participantId,
                totalScore: 0,
                roundScores: {
                    round1: 0,
                    round2: 0,
                    round3: 0
                }
            });
        }

        await leaderboard.save();

        return submission;
    }

    let isCorrect = true;
    let outputs = [];

    // ============================
    // ✅ NORMALIZATION
    // ============================
    const normalize = (s) =>
        (s ?? "")
            .replace(/\r/g, "")
            .trim();

    // ============================
    // ✅ SMART COMPARATOR
    // ============================
    const isMatch = (user, expected) => {

        const u = normalize(user);
        const e = normalize(expected);

        // 🔹 Case 1: single-line output (numbers like this problem)
        if (!u.includes("\n") && !e.includes("\n")) {
            return u === e;
        }

        // 🔹 Case 2: multi-line output (patterns / matrices)
        const uLines = u.split("\n").map(x => x.trim());
        const eLines = e.split("\n").map(x => x.trim());

        if (uLines.length !== eLines.length) return false;

        for (let i = 0; i < uLines.length; i++) {
            if (uLines[i] !== eLines[i]) return false;
        }

        return true;
    };

    // 2️⃣ Execute code
    for (let i = 0; i < inputs.length; i++) {

        const res = await executeCode(trimmedCode, language, inputs[i]);

        if (!res || res.status !== "success") {
            isCorrect = false;
            outputs.push("ERROR");
            break;
        }

        const userOutput = res.output ?? "";
        outputs.push(userOutput);

        if (!isMatch(userOutput, expectedOutputs[i])) {
            isCorrect = false;
            break;
        }
    }

    // 3️⃣ Score
    const score = calculateScore(round, isCorrect);

    // 4️⃣ Save submission
    const submission = await Submission.create({
        participantId,
        problemId,
        round,
        code: trimmedCode,
        output: JSON.stringify(outputs),
        isCorrect,
        scoreAwarded: score,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        submittedAt: submittedAt ? new Date(submittedAt) : new Date()
    });

    // ============================
    // 🏆 LEADERBOARD LOGIC
    // ============================

    let leaderboard = await Leaderboard.findOne({ participantId });

    if (!leaderboard) {
        leaderboard = await Leaderboard.create({
            participantId,
            totalScore: score,
            roundScores: {
                round1: 0,
                round2: 0,
                round3: 0
            }
        });
    }

    if (round === 1.1 || round === 1.2) {
        leaderboard.roundScores.round1 += score;
    } else if (round === 2) {
        leaderboard.roundScores.round2 += score;
    } else if (round === 3) {
        leaderboard.roundScores.round3 += score;
    }

    leaderboard.totalScore =
        (leaderboard.roundScores.round1 || 0) +
        (leaderboard.roundScores.round2 || 0) +
        (leaderboard.roundScores.round3 || 0);

    leaderboard.lastUpdated = new Date();

    await leaderboard.save();

    return submission;
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