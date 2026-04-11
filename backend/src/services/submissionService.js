// @ts-nocheck
import Submission from "../models/Submission.js";
import Problem from "../models/Problems.js";
import { executeCode } from "./codeService.js"

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

    if (!participantId || !problemId || !round || !code || !language) {
        throw new Error("Missing required fields");
    }

    const problem = await Problem.findById(problemId);
    if (!problem) throw new Error("Problem not found");

    const inputs = problem.input;
    const expectedOutputs = problem.expectedOutput;

    if (!inputs || !expectedOutputs || inputs.length !== expectedOutputs.length) {
        throw new Error("Invalid test cases");
    }

    let isCorrect = true;
    let outputs = [];

    const isMatch = (user, expected) =>
        user.trim().replace(/\s+/g, " ") ===
        expected.trim().replace(/\s+/g, " ");

    for (let i = 0; i < inputs.length; i++) {

        const res = await executeCode(code, language, inputs[i]);

        if (!res || res.status !== "success") {
            isCorrect = false;
            outputs.push("ERROR");
            break;
        }

        const userOutput = res.output?.trim() || "";
        outputs.push(userOutput);

        if (!isMatch(userOutput, expectedOutputs[i])) {
            isCorrect = false;
            break;
        }
    }

    const score = calculateScore(round, isCorrect);

    const submission = await Submission.create({
        participantId,
        problemId,
        round,
        code,
        output: JSON.stringify(outputs),
        isCorrect,
        scoreAwarded: score,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        submittedAt: submittedAt ? new Date(submittedAt) : new Date()
    });

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