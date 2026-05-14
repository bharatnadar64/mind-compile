// @ts-nocheck
import mongoose from "mongoose";

const AntiCheatSessionSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, unique: true },
    round: { type: Number, required: true },

    // Lifecycle
    startedAt: { type: Date, default: Date.now },
    lastHeartbeat: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true, index: true },
    endedAt: { type: Date },
    endReason: {
      type: String,
      enum: ["submitted", "timeout", "disqualified", "navigated_away", "admin_terminated"],
    },

    // Scores
    suspicionScore: { type: Number, default: 0, min: 0 },
    riskCategory: {
      type: String,
      enum: ["SAFE", "SUSPICIOUS", "DOUBTFUL", "CONFIRMED"],
      default: "SAFE",
      index: true,
    },
    cheatProbability: { type: Number, default: 0, min: 0, max: 100 },
    confidence: { type: Number, default: 0, min: 0, max: 100 },
    trustScore: { type: Number, default: 100, min: 0, max: 100 },

    // Event tracking
    eventCounts: { type: mongoose.Schema.Types.Mixed, default: {} },
    totalEvents: { type: Number, default: 0 },

    // Penalties applied
    isDisqualified: { type: Boolean, default: false },
    isFrozen: { type: Boolean, default: false },
    executionsRestricted: { type: Boolean, default: false },
    pointsDeducted: { type: Number, default: 0 },
    warningCount: { type: Number, default: 0 },

    // Multi-tab detection
    tabCount: { type: Number, default: 1 },
    multiTabDetected: { type: Boolean, default: false },

    // Tampering
    tamperingDetected: { type: Boolean, default: false },
    tamperingCount: { type: Number, default: 0 },

    // Score decay tracking
    lastDecayAt: { type: Date, default: Date.now },
    lastEventAt: { type: Date, default: Date.now },

    // Rate limiting (spam detection)
    eventRateBucket: { type: Number, default: 0 },
    eventRateBucketResetAt: { type: Date, default: Date.now },

    // Browser info
    browserInfo: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Violation summary (denormalized for fast admin reads)
    violationSummary: {
      blur: { type: Number, default: 0 },
      tabHidden: { type: Number, default: 0 },
      fullscreenExit: { type: Number, default: 0 },
      multiTab: { type: Number, default: 0 },
      devTools: { type: Number, default: 0 },
      splitScreen: { type: Number, default: 0 },
      suspicious_resize: { type: Number, default: 0 },
      zoom_change: { type: Number, default: 0 },
      inactivity: { type: Number, default: 0 },
      network_disconnect: { type: Number, default: 0 },
      heartbeat_miss: { type: Number, default: 0 },
      tampering: { type: Number, default: 0 },
      refresh_abuse: { type: Number, default: 0 },
      second_monitor: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

AntiCheatSessionSchema.index({ participantId: 1, round: 1 });
AntiCheatSessionSchema.index({ isActive: 1, riskCategory: 1 });
AntiCheatSessionSchema.index({ lastHeartbeat: -1 });

export default mongoose.model("AntiCheatSession", AntiCheatSessionSchema);
