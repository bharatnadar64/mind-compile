import express from "express";
import {
    createEntryController,
    getLeaderboardController,
    getEntryByParticipantController,
    updateEntryController,
    deleteEntryController
} from "../controllers/leaderbController.js";

const leaderbRouter = express.Router();

leaderbRouter.post("/", createEntryController);
leaderbRouter.get("/", getLeaderboardController);
leaderbRouter.get("/:participantId", getEntryByParticipantController);
leaderbRouter.put("/:participantId", updateEntryController);
leaderbRouter.delete("/:participantId", deleteEntryController);

export default leaderbRouter;