// @ts-nocheck
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // attach user info
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};