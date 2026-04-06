// @ts-nocheck
// src/services/problemService.js
import Problem from "../models/Problems.js";

/*
 * Add a new problem
 */
export const addProblem = async (problemData) => {
    const problem = await Problem.create(problemData);
    return problem;
};

/*
 * Get all problems
 */
export const getAllProblems = async () => {
    const problems = await Problem.find().sort({ createdAt: -1 });
    return problems;
};

/*
 * Get a problem by ID
 */
export const getProblemByRound = async (round) => {
    const problem = await Problem.findOne({ round }); // findOne because multiple problems can exist per round
    if (!problem) throw new Error("Problem not found");
    return problem;
};

/*
 * Update a problem by ID
 */
export const updateProblemByRound = async (round, updateData) => {
    const problem = await Problem.findOneAndUpdate(
        { round },
        updateData,
        {
            returnDocument: 'after',  // replaces `new: true`
            runValidators: true
        }
    );

    if (!problem) throw new Error(`Problem not found for round ${round}`);
    return problem;
};
/*
 * Delete a problem by ID
 */
export const deleteProblemByRound = async (round) => {
    const problem = await Problem.findOneAndDelete({ round });

    if (!problem) throw new Error(`Problem not found for round ${round}`);
    return problem;
};