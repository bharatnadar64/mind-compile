// @ts-nocheck
import Leaderboard from "../models/LeaderBoard.js";

// Create / Add entry
export const createEntry = async (data) => {
    return await Leaderboard.create(data);
};

// Get full leaderboard (sorted by score DESC)
export const getLeaderboard = async () => {
    return await Leaderboard.find()
        .populate("participantId", "name email college")
        .sort({ totalScore: -1 });
};

// Get single participant entry
export const getEntryByParticipant = async (participantId) => {
    return await Leaderboard.findOne({ participantId })
        .populate("participantId", "name email college");
};

// Update entry
export const updateEntry = async (participantId, data) => {
    return await Leaderboard.findOneAndUpdate(
        { participantId },
        { ...data, lastUpdated: new Date() },
        { new: true }
    );
};

// Delete entry
export const deleteEntry = async (participantId) => {
    return await Leaderboard.findOneAndDelete({ participantId });
};