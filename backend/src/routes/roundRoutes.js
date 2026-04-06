// @ts-nocheck
import express from "express";
import {
    createRoundController,
    getAllRoundsController,
    getRoundByIdController,
    updateRoundController,
    deleteRoundController
} from "../controllers/roundController.js";

const roundRouter = express.Router();

roundRouter.post("/", createRoundController);
roundRouter.get("/", getAllRoundsController);
roundRouter.get("/:id", getRoundByIdController);
roundRouter.put("/:id", updateRoundController);
roundRouter.delete("/:id", deleteRoundController);

export default roundRouter;