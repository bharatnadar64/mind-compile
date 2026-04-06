// @ts-nocheck
// src/services/submissionService.js
import Submission from "../models/Submission.js";

/*
 * Submit a new solution
 * @param {ObjectId} participantId
 * @param {ObjectId} problemId
 * @param {Number} round
 * @param {String} code
 */
export const submitSolution = async (participantId, problemId, round, code) => {
    const submission = new Submission({ participantId, problemId, round, code });
    const savedSubmission = await submission.save();
    return savedSubmission;
};

/*
 * Get all submissions
 */
export const getAllSubmissions = async () => {
    return await Submission.find()
        .populate("participantId", "name email")
        .populate("problemId", "title difficulty round");
};

/*
 * Get submissions by participant
 */
export const getSubmissionsByParticipant = async (participantId) => {
    return await Submission.find({ participantId })
        .populate("problemId", "title difficulty round");
};

/**
 * Get submissions by problem
 */
export const getSubmissionsByProblem = async (problemId) => {
    return await Submission.find({ problemId })
        .populate("participantId", "name email");
};

/*
 * Update submission result (isCorrect + scoreAwarded)
 * @param {string} submissionId - submission _id
 * @param {boolean} isCorrect
 * @param {number} score
 */
export const updateSubmissionResult = async (submissionId, isCorrect, score) => {
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error("Submission not found");

    submission.isCorrect = isCorrect;
    submission.scoreAwarded = isCorrect ? score : 0;

    return await submission.save();
};