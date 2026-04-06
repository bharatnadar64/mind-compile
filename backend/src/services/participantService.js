// @ts-nocheck
// src/services/participantService.js
import Participant from "../models/Participant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";

/*
 * Register a new participant
 * @param {Object} participantData - { name, email, password, college }
 * @returns {Object} - Created participant (without password)
 */
export const registerParticipant = async (participantData) => {
    const { name, email, password, college } = participantData;

    // 1️⃣ Check if email already exists
    const existing = await Participant.findOne({ email });
    if (existing) {
        throw new Error("Email already registered");
    }

    // 2️⃣ Hash the password with bcryptjs
    const saltRounds = Number(process.env.SALT)
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Create participant with hashed password
    const participant = await Participant.create({
        name,
        email,
        password: hashedPassword,
        college,
    });

    // 4️⃣ Return participant data without password
    const participantObj = participant.toObject();
    delete participantObj.password;

    return participantObj;
};

// Login participant
export const loginParticipant = async ({ email, password }) => {
    // 1️⃣ Find user
    const participant = await Participant.findOne({ email });
    if (!participant) {
        throw new Error("Invalid email or password");
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, participant.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // 3️⃣ Generate token
    const token = generateToken(participant);

    // 4️⃣ Return user + token
    const participantObj = participant.toObject();
    delete participantObj.password;

    return {
        participant: participantObj,
        token
    };
};