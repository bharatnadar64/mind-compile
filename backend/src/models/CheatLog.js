// @ts-nocheck
import mongoose from "mongoose";

const CheatLogSchema = new mongoose.Schema({
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participant",
    required: true,
    index: true,
  },
  sessionId: { type: String, required: true, index: true },
  round: { type: Number, required: true, index: true },

  eventType: { type: String, required: true },
  scoreImpact: { type: Number, default: 0 },
  suspicionScoreAfter: { type: Number, default: 0 },
  riskCategory: {
    type: String,
    enum: ["SAFE", "SUSPICIOUS", "DOUBTFUL", "CONFIRMED"],
    default: "SAFE",
    index: true,
  },
  confidence: { type: Number, default: 0, min: 0, max: 100 },

  browserInfo: {
    userAgent: { type: String, default: "" },
    screenWidth: { type: Number, default: 0 },
    screenHeight: { type: Number, default: 0 },
    windowWidth: { type: Number, default: 0 },
    windowHeight: { type: Number, default: 0 },
    platform: { type: String, default: "" },
    language: { type: String, default: "" },
    timezone: { type: String, default: "" },
    colorDepth: { type: Number, default: 0 },
    pixelRatio: { type: Number, default: 1 },
  },

  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },

  actionTaken: {
    type: String,
    enum: ["none", "warning", "deduct_points", "restrict_executions", "freeze", "disqualify"],
    default: "none",
  },

  isTampering: { type: Boolean, default: false },
  isSpam: { type: Boolean, default: false },
});

CheatLogSchema.index({ participantId: 1, round: 1, timestamp: -1 });
CheatLogSchema.index({ timestamp: -1 });

export default mongoose.model("CheatLog", CheatLogSchema);
