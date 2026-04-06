// src/routes/problemRoutes.js
import express from "express";
import {
    createProblem,
    listProblems,
    getProblem,
    modifyProblem,
    removeProblem,
} from "../controllers/problemController.js";

const problemRouter = express.Router();

// Create
problemRouter.post("/", createProblem);

// Read all
problemRouter.get("/", listProblems);

// Read one
problemRouter.get("/:round", getProblem);

// Update
problemRouter.put("/:round", modifyProblem);

// Delete
problemRouter.delete("/:round", removeProblem);

export default problemRouter;