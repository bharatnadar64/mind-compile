// @ts-nocheck 
import express from "express";
import { protect, isAdmin } from "../middleware/auth.js";

import {
    getAllSubmissions,
    giveBonusPoints,
    getLeaderboardController,
} from "../controllers/adminController.js";

import {
    getAllUsers,
    updateUser,
    deleteUser
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(protect, isAdmin);

// 📊 Leaderboard
adminRouter.get("/leaderboard", getLeaderboardController);

// 🧑‍💻 All submissions
adminRouter.get("/submissions", getAllSubmissions);

// 🎯 Bonus points
adminRouter.put("/bonus/:submissionId", giveBonusPoints);

// 👤 USERS
adminRouter.get("/users", getAllUsers);
adminRouter.put("/users/:userId", updateUser);
adminRouter.delete("/users/:userId", deleteUser);


export default adminRouter;