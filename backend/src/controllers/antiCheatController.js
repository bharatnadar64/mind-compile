// @ts-nocheck
import {
  startSession,
  ingestEvent,
  processHeartbeat,
  endSession,
  getLiveSessions,
  getRecentLogs,
  getParticipantLogs,
  getAdminSummary,
  forceDisqualify,
} from "../services/antiCheatService.js";
import AntiCheatSession from "../models/AntiCheatSession.js";
import CheatLog from "../models/CheatLog.js";

// ════════════════════════════════════════════════════════════════════════════
// POST /api/anticheat/session/start
// Called when contestant enters the coding round
// ════════════════════════════════════════════════════════════════════════════
export const startSessionController = async (req, res) => {
  try {
    const { round, sessionId, browserInfo } = req.body;
    const participantId = req.user.id;

    if (!round || !sessionId) {
      return res.status(400).json({ error: "round and sessionId are required" });
    }

    const session = await startSession({ participantId, round, sessionId, browserInfo });
    res.status(201).json({
      sessionId: session.sessionId,
      suspicionScore: 0,
      riskCategory: "SAFE",
      cheatProbability: 0,
      trustScore: 100,
      isFrozen: false,
      isDisqualified: false,
      executionsRestricted: false,
    });
  } catch (err) {
    console.error("[AntiCheat] startSession error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// POST /api/anticheat/event
// Ingest a single behavioral event
// ════════════════════════════════════════════════════════════════════════════
export const ingestEventController = async (req, res) => {
  try {
    const { sessionId, round, eventType, metadata, browserInfo, clientTimestamp } = req.body;
    const participantId = req.user.id;

    if (!sessionId || !round || !eventType) {
      return res.status(400).json({ error: "sessionId, round, and eventType are required" });
    }

    // Validate eventType against allowlist to prevent injection
    const ALLOWED_EVENTS = [
      "blur", "tab_hidden", "fullscreen_exit", "devtools", "multi_tab",
      "split_screen", "suspicious_resize", "zoom_change", "inactivity",
      "network_disconnect", "reconnect", "heartbeat_miss", "tampering",
      "refresh_abuse", "second_monitor", "excessive_focus_loss", "abnormal_burst",
    ];
    if (!ALLOWED_EVENTS.includes(eventType)) {
      return res.status(400).json({ error: "Invalid event type" });
    }

    const result = await ingestEvent({
      participantId,
      sessionId,
      round,
      eventType,
      metadata: metadata || {},
      browserInfo: browserInfo || {},
      clientTimestamp: clientTimestamp || Date.now(),
    });

    if (result.error) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("[AntiCheat] ingestEvent error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// POST /api/anticheat/heartbeat
// Regular heartbeat from the frontend (every 5–10 seconds)
// ════════════════════════════════════════════════════════════════════════════
export const heartbeatController = async (req, res) => {
  try {
    const { sessionId, tabCount, localStorageIntact } = req.body;
    const participantId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const result = await processHeartbeat({
      sessionId,
      participantId,
      tabCount,
      localStorageIntact,
    });

    if (result.error) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("[AntiCheat] heartbeat error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// POST /api/anticheat/session/end
// Called on submit, timeout, navigation away
// ════════════════════════════════════════════════════════════════════════════
export const endSessionController = async (req, res) => {
  try {
    const { sessionId, reason } = req.body;
    const participantId = req.user.id;

    if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

    const session = await endSession({ sessionId, participantId, reason });
    res.json({ message: "Session ended", endReason: reason });
  } catch (err) {
    console.error("[AntiCheat] endSession error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET /api/anticheat/admin/live
// Admin: live sessions + recent events + summary (polled every 3s)
// ════════════════════════════════════════════════════════════════════════════
export const getLiveDataController = async (req, res) => {
  try {
    const [activeSessions, recentLogs, summary] = await Promise.all([
      getLiveSessions(),
      getRecentLogs(30),
      getAdminSummary(),
    ]);

    res.json({ activeSessions, recentLogs, summary });
  } catch (err) {
    console.error("[AntiCheat] getLiveData error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET /api/anticheat/admin/logs
// Admin: all cheat logs (paginated)
// ════════════════════════════════════════════════════════════════════════════
export const getAllLogsController = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await getRecentLogs(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET /api/anticheat/admin/logs/:participantId
// Admin: cheat logs for a specific participant
// ════════════════════════════════════════════════════════════════════════════
export const getParticipantLogsController = async (req, res) => {
  try {
    const { participantId } = req.params;
    const logs = await getParticipantLogs(participantId);
    const session = await AntiCheatSession.findOne({ participantId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ logs, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET /api/anticheat/admin/summary
// Admin: aggregate statistics
// ════════════════════════════════════════════════════════════════════════════
export const getSummaryController = async (req, res) => {
  try {
    const summary = await getAdminSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// POST /api/anticheat/admin/disqualify
// Admin: force-disqualify a participant
// ════════════════════════════════════════════════════════════════════════════
export const forceDisqualifyController = async (req, res) => {
  try {
    const { participantId, round, reason } = req.body;
    if (!participantId || !round) {
      return res.status(400).json({ error: "participantId and round are required" });
    }
    await forceDisqualify(participantId, round, reason || "Admin action");
    res.json({ message: "Participant disqualified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET /api/anticheat/admin/sessions/all
// Admin: all sessions (history)
// ════════════════════════════════════════════════════════════════════════════
export const getAllSessionsController = async (req, res) => {
  try {
    const sessions = await AntiCheatSession.find()
      .populate("participantId", "name email college")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
