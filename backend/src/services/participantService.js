// @ts-nocheck
// src/services/participantService.js
import Participant from "../models/Participant.js";
import bcrypt from "bcryptjs";

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