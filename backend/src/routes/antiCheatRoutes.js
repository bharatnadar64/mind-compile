// @ts-nocheck
import express from "express";
import { protect, isAdmin } from "../middleware/auth.js";
import {
  startSessionController,
  ingestEventController,
  heartbeatController,
  endSessionController,
  getLiveDataController,
  getAllLogsController,
  getParticipantLogsController,
  getSummaryController,
  forceDisqualifyController,
  getAllSessionsController,
} from "../controllers/antiCheatController.js";

const antiCheatRouter = express.Router();

// ─── PARTICIPANT ROUTES (require auth) ───────────────────────────────────────
antiCheatRouter.post("/session/start", protect, startSessionController);
antiCheatRouter.post("/event", protect, ingestEventController);
antiCheatRouter.post("/heartbeat", protect, heartbeatController);
antiCheatRouter.post("/session/end", protect, endSessionController);

// ─── ADMIN ROUTES (require auth + isAdmin) ───────────────────────────────────
antiCheatRouter.get("/admin/live", protect, isAdmin, getLiveDataController);
antiCheatRouter.get("/admin/logs", protect, isAdmin, getAllLogsController);
antiCheatRouter.get("/admin/logs/:participantId", protect, isAdmin, getParticipantLogsController);
antiCheatRouter.get("/admin/summary", protect, isAdmin, getSummaryController);
antiCheatRouter.get("/admin/sessions/all", protect, isAdmin, getAllSessionsController);
antiCheatRouter.post("/admin/disqualify", protect, isAdmin, forceDisqualifyController);

export default antiCheatRouter;
