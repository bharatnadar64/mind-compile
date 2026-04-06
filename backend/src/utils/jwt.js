// @ts-nocheck
import jwt from "jsonwebtoken";

export const generateToken = (participant) => {
    return jwt.sign(
        {
            id: participant._id,
            email: participant.email,
            isAdmin: participant.isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};