// src/routes/submissionRoutes.js
import express from "express";
import {
    submitSolutionController,
    getAllSubmissionsController,
    getSubmissionsByParticipantController,
    getSubmissionsByProblemController,
    updateSubmissionResultController
} from "../controllers/submissionController.js";

const submissionRrouter = express.Router();

// Submit a new solution
submissionRrouter.post("/", submitSolutionController);

// Get all submissions
submissionRrouter.get("/", getAllSubmissionsController);

// Get submissions by participant
submissionRrouter.get("/participant/:participantId", getSubmissionsByParticipantController);

// Get submissions by problem
submissionRrouter.get("/problem/:problemId", getSubmissionsByProblemController);

// Update submission result (isCorrect + scoreAwarded)
submissionRrouter.put("/update/:submissionId", updateSubmissionResultController);

export default submissionRrouter;