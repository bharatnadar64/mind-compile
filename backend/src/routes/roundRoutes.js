// @ts-nocheck
import express from "express";
import { protect } from "../middleware/auth.js";
import {
    createRoundController,
    getAllRoundsController,
    unlockNextRoundController,
    getRoundByIdController,
    getRoundByNumberController, // ✅ NEW import
    updateRoundController,
    deleteRoundController
} from "../controllers/roundController.js";

const roundRouter = express.Router();

roundRouter.post("/", createRoundController);
roundRouter.get("/", protect, getAllRoundsController);
roundRouter.post("/unlock", protect, unlockNextRoundController);

// ✅ NEW: lookup by roundNumber (e.g. GET /api/rounds/1)
// Must be placed BEFORE /:id to avoid conflict
roundRouter.get("/number/:roundNumber", getRoundByNumberController);

roundRouter.get("/:id", getRoundByIdController);
roundRouter.put("/:id", updateRoundController);
roundRouter.delete("/:id", deleteRoundController);

export default roundRouter;
