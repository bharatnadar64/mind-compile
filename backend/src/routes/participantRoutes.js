// @ts-nocheck
// src/routes/participantRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { register, login, getMe } from "../controllers/participantController.js";


const participantRouter = express.Router();

// POST /api/participants/register
participantRouter.post("/register", register);
participantRouter.post("/login", login);
// GET current participant info (protected)
participantRouter.get("/me", protect, getMe);


export default participantRouter;