// @ts-nocheck
// src/controllers/participantController.js
import Participant from "../models/Participant.js";

// Get current logged‑in participant info
export const getMe = async (req, res) => {
  try {
    const participant = await Participant.findById(req.user.id).select("-password");
    if (!participant) return res.status(404).json({ message: "User not found" });
    res.json(participant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import { registerParticipant } from "../services/participantService.js";
import { loginParticipant } from "../services/participantService.js";


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

// Login controller
export const login = async (req, res) => {
    try {
        const data = await loginParticipant(req.body);

        res.json({
            message: "Login successful",
            ...data
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};