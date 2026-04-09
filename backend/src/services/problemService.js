// @ts-nocheck
// src/services/problemService.js
import Problem from "../models/Problems.js";

/*
 * Add a new problem
 */
export const addProblem = async (problemData) => {
    const { title, description, difficulty, round, input, expectedOutput } = problemData;

    if (!Array.isArray(input) || !Array.isArray(expectedOutput)) {
        throw new Error("Input and ExpectedOutput must be arrays");
    }

    if (input.length !== expectedOutput.length) {
        throw new Error("Input and Output arrays must be of same length");
    }

    const problem = await Problem.create({
        title,
        description,
        difficulty,
        round,
        input,
        expectedOutput
    });

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