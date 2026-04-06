// src/routes/participantRoutes.js
import express from "express";
import { register } from "../controllers/participantController.js";

const participantRouter = express.Router();

// POST /api/participants/register
participantRouter.post("/register", register);

export default participantRouter;