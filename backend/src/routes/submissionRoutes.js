// src/routes/submissionRoutes.js
import express from "express";
import {
    submitSolutionController,
    getAllSubmissionsController,
    getSubmissionsByParticipantController,
    getSubmissionsByProblemController,
    updateSubmissionResultController
} from "../controllers/submissionController.js";

const router = express.Router();

// Submit a new solution
router.post("/", submitSolutionController);

// Get all submissions
router.get("/", getAllSubmissionsController);

// Get submissions by participant
router.get("/participant/:participantId", getSubmissionsByParticipantController);

// Get submissions by problem
router.get("/problem/:problemId", getSubmissionsByProblemController);

// Update submission result (isCorrect + scoreAwarded)
router.put("/update/:submissionId", updateSubmissionResultController);

export default router;