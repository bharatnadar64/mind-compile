// @ts-nocheck
// src/controllers/participantController.js
import { registerParticipant } from "../services/participantService.js";

/*
 * Controller to handle participant registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const register = async (req, res) => {
    try {
        // Call service to register participant
        const participant = await registerParticipant(req.body);

        // Return success response
        res.status(201).json({
            message: "Participant registered successfully",
            participant,
        });
    } catch (error) {
        // Return error response
        res.status(400).json({ error: error.message });
    }
};