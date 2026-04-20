// @ts-nocheck
import Round from "../models/RoundConfig.js";

// Create a round
export const createRound = async (data) => {
    return await Round.create(data);
};

// Get all rounds
export const getAllRounds = async () => {
    return await Round.find().sort({ roundNumber: 1 });
};

// Get round by ID
export const getRoundById = async (id) => {
    return await Round.findById(id);
};

// Update round
export const updateRound = async (id, data) => {
    return await Round.findByIdAndUpdate(id, data, { new: true });
};

// Delete round
export const deleteRound = async (id) => {
    return await Round.findByIdAndDelete(id);
};

