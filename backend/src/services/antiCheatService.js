// @ts-nocheck
/**
 * ANTI-CHEAT SERVICE — Core suspicion scoring engine
 * All scoring is authoritative on the server. Frontend is never trusted alone.
 */
import AntiCheatSession from "../models/AntiCheatSession.js";
import CheatLog from "../models/CheatLog.js";
import Participant from "../models/Participant.js";

// ─── EVENT WEIGHTS ──────────────────────────────────────────────────────────
const EVENT_WEIGHTS = {
  blur: 5,
  tab_hidden: 8,
  fullscreen_exit: 10,
  devtools: 35,
  multi_tab: 40,
  split_screen: 20,
  suspicious_resize: 8,
  zoom_change: 5,
  inactivity: 3,
  network_disconnect: 7,
  reconnect: 5,
  heartbeat_miss: 15,
  tampering: 50,
  refresh_abuse: 15,
  second_monitor: 15,
  excessive_focus_loss: 12,
  abnormal_burst: 18,
  extreme_absence: 100,
  clipboard_paste: 25,
  clipboard_copy: 5,
};

// Max events per 10-second window before spam detection kicks in
const SPAM_THRESHOLD = 20;
const SPAM_WINDOW_MS = 10_000;

// Score decay: -2 points per 60 seconds of clean behavior
const DECAY_AMOUNT = 2;
const DECAY_INTERVAL_MS = 60_000;

// Heartbeat timeout: if >30s since last heartbeat → miss
const HEARTBEAT_TIMEOUT_MS = 30_000;

// ─── REPEAT MULTIPLIER ───────────────────────────────────────────────────────
const getRepeatMultiplier = (count) => {
  if (count <= 1) return 1.0;
  if (count === 2) return 1.3;
  if (count === 3) return 1.6;
  if (count === 4) return 2.0;
  return 2.5; // 5th+ occurrence → max
};

// ─── RISK CATEGORY ───────────────────────────────────────────────────────────
const getRiskCategory = (score) => {
  if (score >= 80) return "CONFIRMED";
  if (score >= 50) return "DOUBTFUL";
  if (score >= 25) return "SUSPICIOUS";
  return "SAFE";
};

// ─── CHEAT PROBABILITY ───────────────────────────────────────────────────────
const calcCheatProbability = (score) => Math.min(100, Math.round((score / 80) * 100));

// ─── CONFIDENCE ──────────────────────────────────────────────────────────────
const calcConfidence = (totalEvents, eventCounts) => {
  const eventVariety = Object.keys(eventCounts).length;
  const raw = totalEvents * 3 + eventVariety * 8;
  return Math.min(100, Math.round(raw));
};

// ─── TRUST SCORE ─────────────────────────────────────────────────────────────
const calcTrustScore = (suspicionScore) => Math.max(0, 100 - suspicionScore);

// ─── VALIDATE IMPOSSIBLE BEHAVIOR ────────────────────────────────────────────
const isImpossibleBehavior = (session, eventType, timestamp) => {
  // If we just received a blur AND a focus within 50ms — impossible
  const lastEvent = session.lastEventAt;
  const timeSinceLast = timestamp - new Date(lastEvent).getTime();
  // Extremely rapid sequential contradictory events
  if (timeSinceLast < 50 && session.totalEvents > 5) return true;
  return false;
};

// ─── SPAM DETECTION ──────────────────────────────────────────────────────────
const isSpamEvent = (session, now) => {
  const bucketAge = now - new Date(session.eventRateBucketResetAt).getTime();
  if (bucketAge > SPAM_WINDOW_MS) return false; // bucket expired
  return session.eventRateBucket >= SPAM_THRESHOLD;
};

// ─── APPLY SCORE DECAY ───────────────────────────────────────────────────────
const applyDecay = (session, now) => {
  const msSinceDecay = now - new Date(session.lastDecayAt).getTime();
  const decayCycles = Math.floor(msSinceDecay / DECAY_INTERVAL_MS);
  if (decayCycles <= 0) return session.suspicionScore;
  const decayed = Math.max(0, session.suspicionScore - decayCycles * DECAY_AMOUNT);
  return decayed;
};

// ─── DETERMINE ACTION ────────────────────────────────────────────────────────
const determineAction = (riskCategory, previousCategory) => {
  if (riskCategory === "CONFIRMED") return "disqualify";
  if (riskCategory === "DOUBTFUL" && previousCategory !== "DOUBTFUL" && previousCategory !== "CONFIRMED")
    return "deduct_points";
  if (riskCategory === "SUSPICIOUS" && previousCategory === "SAFE") return "warning";
  if (riskCategory === "CONFIRMED") return "freeze";
  return "none";
};

// ════════════════════════════════════════════════════════════════════════════
// START SESSION
// ════════════════════════════════════════════════════════════════════════════
export const startSession = async ({ participantId, round, sessionId, browserInfo, clientIp }) => {
  // Find the most recent session for this participant+round to carry over state
  const previousSession = await AntiCheatSession.findOne(
    { participantId, round },
    {
      suspicionScore: 1, riskCategory: 1, cheatProbability: 1, trustScore: 1,
      isFrozen: 1, isDisqualified: 1, executionsRestricted: 1,
      eventCounts: 1, totalEvents: 1, violationSummary: 1,
      warningCount: 1, pointsDeducted: 1, tamperingDetected: 1, tamperingCount: 1,
    }
  ).sort({ createdAt: -1 }).lean();

  // Also check if participant is globally disqualified
  const participant = await Participant.findById(participantId, "isDisqualified disqualifiedRounds").lean();
  const isGloballyDisqualified = participant?.isDisqualified ||
    (participant?.disqualifiedRounds || []).includes(round);

  // Close any stale active sessions for this participant+round
  await AntiCheatSession.updateMany(
    { participantId, round, isActive: true },
    {
      $set: {
        isActive: false,
        endedAt: new Date(),
        endReason: "navigated_away",
      },
    }
  );

  // Carry over state from previous session (prevents reload bypass)
  const carryOver = previousSession ? {
    suspicionScore: previousSession.suspicionScore || 0,
    riskCategory: previousSession.riskCategory || "SAFE",
    cheatProbability: previousSession.cheatProbability || 0,
    trustScore: previousSession.trustScore ?? 100,
    isFrozen: previousSession.isFrozen || isGloballyDisqualified || false,
    isDisqualified: previousSession.isDisqualified || isGloballyDisqualified || false,
    executionsRestricted: previousSession.executionsRestricted || false,
    eventCounts: previousSession.eventCounts || {},
    totalEvents: previousSession.totalEvents || 0,
    violationSummary: previousSession.violationSummary || {},
    warningCount: previousSession.warningCount || 0,
    pointsDeducted: previousSession.pointsDeducted || 0,
    tamperingDetected: previousSession.tamperingDetected || false,
    tamperingCount: previousSession.tamperingCount || 0,
  } : {
    isDisqualified: isGloballyDisqualified || false,
    isFrozen: isGloballyDisqualified || false,
  };

  try {
    const session = await AntiCheatSession.create({
      participantId,
      round,
      sessionId,
      browserInfo: { ...browserInfo, clientIp } || { clientIp },
      startedAt: new Date(),
      lastHeartbeat: new Date(),
      lastDecayAt: new Date(),
      lastEventAt: new Date(),
      eventRateBucketResetAt: new Date(),
      ...carryOver,
    });
    return session;
  } catch (err) {
    if (err.code === 11000) {
      return await AntiCheatSession.findOne({ sessionId });
    }
    throw err;
  }
};

// ════════════════════════════════════════════════════════════════════════════
// INGEST EVENT
// ════════════════════════════════════════════════════════════════════════════
export const ingestEvent = async ({
  participantId,
  sessionId,
  round,
  eventType,
  metadata = {},
  browserInfo = {},
  clientTimestamp,
}) => {
  const session = await AntiCheatSession.findOne({ sessionId, participantId, isActive: true });
  if (!session) {
    return { error: "no_active_session", action: "none" };
  }

  const now = Date.now();
  const serverTimestamp = new Date(now);

  // ── Tampering: client timestamp vs server timestamp ───────────────────────
  const timeDrift = clientTimestamp ? Math.abs(now - clientTimestamp) : 0;
  const isTampering = timeDrift > 60_000; // >60 seconds drift = suspicious

  // ── Spam detection ────────────────────────────────────────────────────────
  const bucketAge = now - new Date(session.eventRateBucketResetAt).getTime();
  let eventRateBucket = session.eventRateBucket;
  let eventRateBucketResetAt = session.eventRateBucketResetAt;

  if (bucketAge > SPAM_WINDOW_MS) {
    eventRateBucket = 0;
    eventRateBucketResetAt = serverTimestamp;
  }
  eventRateBucket += 1;

  const isSpam = eventRateBucket > SPAM_THRESHOLD;
  if (isSpam && eventType !== "tampering") {
    // Just record the spam attempt but don't double score legit events
    await AntiCheatSession.findByIdAndUpdate(session._id, {
      eventRateBucket,
      eventRateBucketResetAt,
    });
    return { action: "none", isSpam: true };
  }

  // ── Impossible behavior check ─────────────────────────────────────────────
  const impossible = isImpossibleBehavior(session, eventType, now);
  if (impossible) {
    eventType = "tampering"; // escalate
    metadata.reason = "impossible_timing";
  }

  // ── Apply decay first ─────────────────────────────────────────────────────
  const decayedScore = applyDecay(session, now);
  const msSinceDecay = now - new Date(session.lastDecayAt).getTime();
  const decayCycles = Math.floor(msSinceDecay / DECAY_INTERVAL_MS);

  // ── Calculate score impact ────────────────────────────────────────────────
  const baseWeight = EVENT_WEIGHTS[eventType] ?? 3;
  const eventCounts = session.eventCounts || {};
  const occurrences = (eventCounts[eventType] || 0) + 1;
  const multiplier = getRepeatMultiplier(occurrences);
  let scoreImpact = Math.round(baseWeight * multiplier);

  // Tampering = massive spike
  if (isTampering) scoreImpact += 30;

  const newScore = Math.min(150, decayedScore + scoreImpact);
  const prevCategory = session.riskCategory;
  const newCategory = getRiskCategory(newScore);
  const cheatProbability = calcCheatProbability(newScore);

  // Update event counts
  eventCounts[eventType] = occurrences;
  const newTotalEvents = session.totalEvents + 1;
  const confidence = calcConfidence(newTotalEvents, eventCounts);
  const trustScore = calcTrustScore(newScore);

  // ── Determine action ──────────────────────────────────────────────────────
  const action = determineAction(newCategory, prevCategory);

  // ── Update violation summary ──────────────────────────────────────────────
  const keyMap = {
    "tab_hidden": "tabHidden",
    "fullscreen_exit": "fullscreenExit",
    "multi_tab": "multiTab",
    "devtools": "devTools",
    "split_screen": "splitScreen",
    "suspicious_resize": "suspicious_resize",
    "zoom_change": "zoom_change",
    "inactivity": "inactivity",
    "network_disconnect": "network_disconnect",
    "heartbeat_miss": "heartbeat_miss",
    "tampering": "tampering",
    "refresh_abuse": "refresh_abuse",
    "second_monitor": "second_monitor",
    "blur": "blur"
  };

  const violationKey = keyMap[eventType];
  const violationUpdate = {};
  if (violationKey) {
    violationUpdate[`violationSummary.${violationKey}`] = (session.violationSummary[violationKey] || 0) + 1;
  }

  // ── Prepare session updates ───────────────────────────────────────────────
  const sessionUpdates = {
    suspicionScore: newScore,
    riskCategory: newCategory,
    cheatProbability,
    confidence,
    trustScore,
    eventCounts,
    totalEvents: newTotalEvents,
    lastEventAt: serverTimestamp,
    eventRateBucket,
    eventRateBucketResetAt,
    ...violationUpdate,
  };

  if (decayCycles > 0) {
    sessionUpdates.lastDecayAt = serverTimestamp;
  }

  // ── Apply penalties ───────────────────────────────────────────────────────
  if (action === "disqualify") {
    sessionUpdates.isDisqualified = true;
    sessionUpdates.isFrozen = true;
    sessionUpdates.isActive = false;
    sessionUpdates.endedAt = serverTimestamp;
    sessionUpdates.endReason = "disqualified";
  } else if (action === "deduct_points") {
    sessionUpdates.executionsRestricted = true;
    sessionUpdates.pointsDeducted = (session.pointsDeducted || 0) + 5;
  } else if (action === "warning") {
    sessionUpdates.warningCount = (session.warningCount || 0) + 1;
  } else if (action === "freeze") {
    sessionUpdates.isFrozen = true;
  }

  if (isTampering) {
    sessionUpdates.tamperingDetected = true;
    sessionUpdates.tamperingCount = (session.tamperingCount || 0) + 1;
  }

  await AntiCheatSession.findByIdAndUpdate(session._id, { $set: sessionUpdates });

  // ── Log the event ─────────────────────────────────────────────────────────
  await CheatLog.create({
    participantId,
    sessionId,
    round,
    eventType,
    scoreImpact,
    suspicionScoreAfter: newScore,
    riskCategory: newCategory,
    confidence,
    browserInfo,
    metadata: { ...metadata, timeDrift, multiplier, occurrences },
    timestamp: serverTimestamp,
    actionTaken: action,
    isTampering,
    isSpam,
  });

  // ── Disqualify in Participant model ───────────────────────────────────────
  if (action === "disqualify") {
    await Participant.findByIdAndUpdate(participantId, {
      $set: { isDisqualified: true },
      $addToSet: { disqualifiedRounds: round },
    });
  }

  return {
    action,
    suspicionScore: newScore,
    riskCategory: newCategory,
    cheatProbability,
    confidence,
    trustScore,
    isFrozen: sessionUpdates.isFrozen || false,
    isDisqualified: sessionUpdates.isDisqualified || false,
    executionsRestricted: sessionUpdates.executionsRestricted || false,
    warningMessage: getWarningMessage(newCategory, eventType),
  };
};

// ════════════════════════════════════════════════════════════════════════════
// PROCESS HEARTBEAT
// ════════════════════════════════════════════════════════════════════════════
export const processHeartbeat = async ({ sessionId, participantId, tabCount, localStorageIntact }) => {
  const session = await AntiCheatSession.findOne({ sessionId, participantId, isActive: true });
  if (!session) return { error: "no_active_session" };

  const now = Date.now();
  const timeSinceLastHeartbeat = now - new Date(session.lastHeartbeat).getTime();

  const updates = { lastHeartbeat: new Date() };
  let missEvent = null;

  // Heartbeat miss detection
  if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT_MS * 2) {
    // More than 2 missed cycles — tampering likely
    missEvent = "tampering";
  } else if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT_MS) {
    missEvent = "heartbeat_miss";
  }

  // Multi-tab detection from heartbeat
  if (tabCount && tabCount > 1 && !session.multiTabDetected) {
    updates.multiTabDetected = true;
    updates.tabCount = tabCount;
    await AntiCheatSession.findByIdAndUpdate(session._id, { $set: updates });
    // Ingest multi_tab event
    return await ingestEvent({
      participantId,
      sessionId,
      round: session.round,
      eventType: "multi_tab",
      metadata: { tabCount, source: "heartbeat" },
      clientTimestamp: now,
    });
  }

  // localStorage tampering detection
  if (localStorageIntact === false) {
    await AntiCheatSession.findByIdAndUpdate(session._id, { $set: updates });
    return await ingestEvent({
      participantId,
      sessionId,
      round: session.round,
      eventType: "tampering",
      metadata: { reason: "localStorage_modified" },
      clientTimestamp: now,
    });
  }

  // Apply decay and update heartbeat
  const decayedScore = applyDecay(session, now);
  const msSinceDecay = now - new Date(session.lastDecayAt).getTime();
  const decayCycles = Math.floor(msSinceDecay / DECAY_INTERVAL_MS);

  if (decayCycles > 0) {
    updates.suspicionScore = decayedScore;
    updates.riskCategory = getRiskCategory(decayedScore);
    updates.cheatProbability = calcCheatProbability(decayedScore);
    updates.trustScore = calcTrustScore(decayedScore);
    updates.lastDecayAt = new Date();
  }

  await AntiCheatSession.findByIdAndUpdate(session._id, { $set: updates });

  if (missEvent) {
    return await ingestEvent({
      participantId,
      sessionId,
      round: session.round,
      eventType: missEvent,
      metadata: { timeSinceLastHeartbeat },
      clientTimestamp: now,
    });
  }

  // Re-fetch updated session
  const updated = await AntiCheatSession.findOne({ sessionId });
  return {
    action: "none",
    suspicionScore: updated.suspicionScore,
    riskCategory: updated.riskCategory,
    cheatProbability: updated.cheatProbability,
    trustScore: updated.trustScore,
    isFrozen: updated.isFrozen,
    isDisqualified: updated.isDisqualified,
    executionsRestricted: updated.executionsRestricted,
  };
};

// ════════════════════════════════════════════════════════════════════════════
// END SESSION
// ════════════════════════════════════════════════════════════════════════════
export const endSession = async ({ sessionId, participantId, reason }) => {
  const session = await AntiCheatSession.findOneAndUpdate(
    { sessionId, participantId, isActive: true },
    {
      $set: {
        isActive: false,
        endedAt: new Date(),
        endReason: reason || "submitted",
      },
    },
    { returnDocument: 'after' }
  );
  return session;
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN: GET LIVE SESSIONS
// ════════════════════════════════════════════════════════════════════════════
export const getLiveSessions = async () => {
  const STALE_THRESHOLD = 45000; // 45 seconds
  const now = new Date();
  
  // Auto-close stale sessions
  await AntiCheatSession.updateMany(
    { isActive: true, lastHeartbeat: { $lt: new Date(now - STALE_THRESHOLD) } },
    { $set: { isActive: false, endReason: "heartbeat_lost", endedAt: now } }
  );

  return await AntiCheatSession.find({ isActive: true })
    .populate("participantId", "name email college")
    .sort({ suspicionScore: -1, lastHeartbeat: -1 })
    .lean();
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN: GET RECENT CHEAT LOGS
// ════════════════════════════════════════════════════════════════════════════
export const getRecentLogs = async (limit = 50) => {
  return await CheatLog.find()
    .populate("participantId", "name email")
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN: GET PARTICIPANT LOGS
// ════════════════════════════════════════════════════════════════════════════
export const getParticipantLogs = async (participantId) => {
  return await CheatLog.find({ participantId })
    .sort({ timestamp: -1 })
    .limit(200)
    .lean();
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN: SUMMARY STATS
// ════════════════════════════════════════════════════════════════════════════
export const getAdminSummary = async () => {
  const STALE_THRESHOLD = 45000;
  const now = new Date();

  const [activeSessions, allSessions, recentLogs] = await Promise.all([
    AntiCheatSession.find({ 
      isActive: true, 
      lastHeartbeat: { $gte: new Date(now - STALE_THRESHOLD) } 
    }).lean(),
    AntiCheatSession.find().lean(),
    CheatLog.find().sort({ timestamp: -1 }).limit(200).lean(),
  ]);

  const byCategory = { SAFE: 0, SUSPICIOUS: 0, DOUBTFUL: 0, CONFIRMED: 0 };
  activeSessions.forEach((s) => {
    const cat = s.riskCategory?.toUpperCase();
    if (byCategory.hasOwnProperty(cat)) {
      byCategory[cat]++;
    }
  });

  const eventTypeCounts = {};
  recentLogs.forEach((l) => {
    eventTypeCounts[l.eventType] = (eventTypeCounts[l.eventType] || 0) + 1;
  });

  return {
    totalActive: activeSessions.length,
    totalSessions: allSessions.length,
    byCategory,
    eventTypeCounts,
    totalDisqualified: allSessions.filter((s) => s.isDisqualified).length,
    totalTamperingDetected: allSessions.filter((s) => s.tamperingDetected).length,
  };
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN: FORCE DISQUALIFY
// ════════════════════════════════════════════════════════════════════════════
export const forceDisqualify = async (participantId, round, adminReason) => {
  await AntiCheatSession.updateMany(
    { participantId, round },
    {
      $set: {
        isDisqualified: true,
        isFrozen: true,
        isActive: false,
        endedAt: new Date(),
        endReason: "disqualified",
        riskCategory: "CONFIRMED",
        suspicionScore: 100,
      },
    }
  );
  await Participant.findByIdAndUpdate(participantId, {
    $set: { isDisqualified: true },
    $addToSet: { disqualifiedRounds: round },
  });
  await CheatLog.create({
    participantId,
    sessionId: "admin_force",
    round,
    eventType: "tampering",
    scoreImpact: 100,
    suspicionScoreAfter: 100,
    riskCategory: "CONFIRMED",
    confidence: 100,
    metadata: { adminAction: true, reason: adminReason },
    actionTaken: "disqualify",
  });
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN: GET ALL PARTICIPANTS ANTI-CHEAT OVERVIEW
// ════════════════════════════════════════════════════════════════════════════
export const getParticipantsAntiCheatInfo = async () => {
  // Get all participants
  const participants = await Participant.find({}, "name email college isDisqualified disqualifiedRounds").lean();
  
  // Get aggregate session data for each
  const stats = await AntiCheatSession.aggregate([
    {
      $group: {
        _id: "$participantId",
        totalSessions: { $sum: 1 },
        maxSuspicion: { $max: "$suspicionScore" },
        avgTrustScore: { $avg: "$trustScore" },
        totalEvents: { $sum: "$totalEvents" },
        multiTabCount: { $sum: { $cond: ["$multiTabDetected", 1, 0] } },
        tamperingCount: { $sum: { $cond: ["$tamperingDetected", 1, 0] } },
      }
    }
  ]);
  
  // Merge
  const statsMap = {};
  stats.forEach(s => { statsMap[s._id.toString()] = s; });
  
  return participants.map(p => ({
    ...p,
    antiCheat: statsMap[p._id.toString()] || {
      totalSessions: 0,
      maxSuspicion: 0,
      avgTrustScore: 100,
      totalEvents: 0,
      multiTabCount: 0,
      tamperingCount: 0
    }
  }));
};

// ─── HELPER ──────────────────────────────────────────────────────────────────
const getWarningMessage = (category, eventType) => {
  const messages = {
    SUSPICIOUS: "⚠️ Suspicious behavior detected. Please stay focused on the contest.",
    DOUBTFUL: "🚨 Multiple violations detected. Points may be deducted. Admin has been notified.",
    CONFIRMED: "🔴 Contest rules violated. You have been disqualified.",
  };
  return messages[category] || null;
};
