// @ts-nocheck 
import express from "express";
import { protect, isAdmin } from "../middleware/auth.js";

import {
    getLeaderboard,
    getAllSubmissions,
    giveBonusPoints,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(protect, isAdmin);

// 📊 Leaderboard
adminRouter.get("/leaderboard", getLeaderboard);

// 🧑‍💻 All submissions
adminRouter.get("/submissions", getAllSubmissions);

// 🎯 Bonus points
adminRouter.put("/bonus/:submissionId", giveBonusPoints);

export default adminRouter;