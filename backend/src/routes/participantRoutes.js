// @ts-nocheck
// src/routes/participantRoutes.js
import express from "express";
import { register, login } from "../controllers/participantController.js";


const participantRouter = express.Router();

// POST /api/participants/register
participantRouter.post("/register", register);
participantRouter.post("/login", login);

export default participantRouter;