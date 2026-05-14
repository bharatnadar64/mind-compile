// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import antiCheatMonitor from "../services/antiCheatMonitor.js";

// Inline UUID v4 generator — no external dependency needed
const uuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

/**
 * useAntiCheat — React hook wrapping the AntiCheatMonitor service.
 *
 * @param {object} options
 * @param {boolean}  options.active       - Whether monitoring should run (true only in coding round)
 * @param {number}   options.round        - Current round number
 * @param {object}   options.api          - Axios instance from context
 * @param {string}   options.participantId
 * @param {function} options.onDisqualify - Called when participant is disqualified
 * @param {function} options.onAutoSubmit - Called when auto-submit is triggered
 * @param {function} options.onFreeze     - Called when editor should be frozen
 */
const useAntiCheat = ({
  active = false,
  round,
  api,
  participantId,
  onDisqualify,
  onAutoSubmit,
  onFreeze,
}) => {
  const sessionIdRef = useRef(null);
  const startedRef = useRef(false);

  const [suspicionScore, setSuspicionScore] = useState(0);
  const [riskCategory, setRiskCategory] = useState("SAFE");
  const [cheatProbability, setCheatProbability] = useState(0);
  const [trustScore, setTrustScore] = useState(100);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [executionsRestricted, setExecutionsRestricted] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningLevel, setWarningLevel] = useState("SUSPICIOUS"); // SUSPICIOUS | DOUBTFUL | CONFIRMED

  // Track previous risk category to detect transitions
  const prevCategoryRef = useRef("SAFE");
  const actionedDisqualifyRef = useRef(false);
  const actionedAutoSubmitRef = useRef(false);

  // ── Handle backend response from any event or heartbeat ────────────────────
  const handleServerResponse = useCallback((eventType, metadata, response) => {
    if (!response) return;

    const {
      suspicionScore: score,
      riskCategory: category,
      cheatProbability: prob,
      trustScore: trust,
      isFrozen: frozen,
      isDisqualified: disq,
      executionsRestricted: restricted,
      warningMessage: msg,
      action,
    } = response;

    if (score !== undefined) setSuspicionScore(score);
    if (prob !== undefined) setCheatProbability(prob);
    if (trust !== undefined) setTrustScore(trust);
    if (restricted !== undefined) setExecutionsRestricted(restricted);

    if (category && category !== prevCategoryRef.current) {
      setRiskCategory(category);
      prevCategoryRef.current = category;

      // SUSPICIOUS → show warning popup
      if (category === "SUSPICIOUS") {
        setWarningLevel("SUSPICIOUS");
        setWarningMessage(msg || "⚠️ Suspicious behavior detected. Please stay focused.");
        setWarningVisible(true);
      }

      // DOUBTFUL → show stronger warning, restrict executions
      if (category === "DOUBTFUL") {
        setWarningLevel("DOUBTFUL");
        setWarningMessage(msg || "🚨 Multiple violations detected. Points will be deducted. Admin has been notified.");
        setWarningVisible(true);
        setExecutionsRestricted(true);
      }

      // CONFIRMED → disqualify + freeze + auto-submit
      if (category === "CONFIRMED" && !actionedDisqualifyRef.current) {
        actionedDisqualifyRef.current = true;
        setWarningLevel("CONFIRMED");
        setWarningMessage(msg || "🔴 You have been disqualified for violating contest rules.");
        setWarningVisible(true);
        setIsFrozen(true);
        setIsDisqualified(true);

        if (!actionedAutoSubmitRef.current) {
          actionedAutoSubmitRef.current = true;
          if (typeof onAutoSubmit === "function") onAutoSubmit();
        }
        if (typeof onDisqualify === "function") onDisqualify();
        if (typeof onFreeze === "function") onFreeze();
      }
    }

    // Action-based handling (can come from any category transition)
    if (action === "disqualify" && !actionedDisqualifyRef.current) {
      actionedDisqualifyRef.current = true;
      setIsFrozen(true);
      setIsDisqualified(true);
      setRiskCategory("CONFIRMED");
      setWarningLevel("CONFIRMED");
      setWarningMessage("🔴 You have been disqualified for violating contest rules.");
      setWarningVisible(true);
      if (!actionedAutoSubmitRef.current) {
        actionedAutoSubmitRef.current = true;
        if (typeof onAutoSubmit === "function") onAutoSubmit();
      }
      if (typeof onDisqualify === "function") onDisqualify();
    }

    if (frozen && !isFrozen) {
      setIsFrozen(true);
      if (typeof onFreeze === "function") onFreeze();
    }

    if (disq && !isDisqualified) {
      setIsDisqualified(true);
    }
  }, [isFrozen, isDisqualified, onAutoSubmit, onDisqualify, onFreeze]);

  // ── Start session on backend ───────────────────────────────────────────────
  const startBackendSession = useCallback(async (sessId) => {
    try {
      await api.post("/api/anticheat/session/start", {
        round,
        sessionId: sessId,
        browserInfo: {
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          platform: navigator.platform || "",
          language: navigator.language || "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pixelRatio: window.devicePixelRatio,
        },
      });
    } catch (err) {
      console.warn("[AntiCheat] Failed to start backend session:", err.message);
    }
  }, [api, round]);

  // ── End session on backend ─────────────────────────────────────────────────
  const stopMonitoring = useCallback(async (reason = "submitted") => {
    if (!startedRef.current) return;
    startedRef.current = false;
    antiCheatMonitor.stop(reason);
    try {
      if (sessionIdRef.current) {
        await api.post("/api/anticheat/session/end", {
          sessionId: sessionIdRef.current,
          reason,
        });
      }
    } catch { }
  }, [api]);

  // ── Main effect: start/stop monitoring based on `active` flag ─────────────
  useEffect(() => {
    if (!active || !round || !api || !participantId) return;
    if (startedRef.current) return;

    const sessId = uuidv4();
    sessionIdRef.current = sessId;
    startedRef.current = true;

    // Start backend session
    startBackendSession(sessId);

    // Start frontend monitor
    antiCheatMonitor.start({
      sessionId: sessId,
      round,
      api,
      onEvent: (eventType, metadata, response) => {
        handleServerResponse(eventType, metadata, response);
      },
    });

    return () => {
      if (startedRef.current) {
        stopMonitoring("navigated_away");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, round, participantId]);

  const dismissWarning = useCallback(() => {
    if (warningLevel !== "CONFIRMED") {
      setWarningVisible(false);
    }
    // CONFIRMED warning cannot be dismissed
  }, [warningLevel]);

  return {
    suspicionScore,
    riskCategory,
    cheatProbability,
    trustScore,
    isFrozen,
    isDisqualified,
    executionsRestricted,
    warningVisible,
    warningMessage,
    warningLevel,
    dismissWarning,
    stopMonitoring,
    sessionId: sessionIdRef.current,
  };
};

export default useAntiCheat;
