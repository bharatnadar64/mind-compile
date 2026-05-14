// @ts-nocheck
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import antiCheatMonitor from "../services/antiCheatMonitor";
import { RoundContext } from "../context/ContextProvider";

// Helper to generate UUID without external dependency
const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

/**
 * useAntiCheat Hook
 * Integrates the behavioral monitoring engine with the React UI.
 * 
 * @param {boolean} active - Whether monitoring should be running
 * @param {number} round - The current contest round
 * @param {object} api - Axios instance from context
 * @param {string} participantId - ID of the contestant
 * @param {function} onDisqualify - Callback for critical failure
 * @param {function} onAutoSubmit - Callback for forced submission
 * @param {function} onFreeze - Callback for UI lock
 */
const useAntiCheat = ({
  active,
  round,
  api,
  participantId,
  onDisqualify,
  onAutoSubmit,
  onFreeze,
}) => {
  const startedRef = useRef(false);
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);

  // Stats from backend
  const [suspicionScore, setSuspicionScore] = useState(0);
  const [riskCategory, setRiskCategory] = useState("SAFE");
  const [cheatProbability, setCheatProbability] = useState(0);
  const [trustScore, setTrustScore] = useState(100);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [executionsRestricted, setExecutionsRestricted] = useState(false);

  // Warning state
  const [warningMessage, setWarningMessage] = useState(null);
  const [warningLevel, setWarningLevel] = useState(null); // SUSPICIOUS | DOUBTFUL | CONFIRMED
  const [warningVisible, setWarningVisible] = useState(false);

  const dismissWarning = useCallback(() => {
    setWarningVisible(false);
    setWarningMessage(null);
    setWarningLevel(null);
  }, []);

  const stopMonitoring = useCallback(async (reason = "submitted") => {
    if (!startedRef.current) return;
    startedRef.current = false;
    antiCheatMonitor.stop(reason);
    try {
      const currentId = sessionIdRef.current;
      if (currentId) {
        await api.post("/api/anticheat/session/end", {
          sessionId: currentId,
          reason,
        });
      }
    } catch { }
  }, [api]);

  // ── Main effect: start/stop monitoring based on `active` flag ─────────────
  useEffect(() => {
    if (!active) {
      if (startedRef.current) stopMonitoring("navigation_away");
      return;
    }

    if (startedRef.current) return;
    
    // Use a local variable to prevent race conditions during the async init
    const sessId = generateUUID();
    setSessionId(sessId);
    sessionIdRef.current = sessId;
    startedRef.current = true;

    // Start backend session
    const initBackend = async () => {
      try {
        await api.post("/api/anticheat/session/start", {
          sessionId: sessId,
          round: round || 1,
          browserInfo: antiCheatMonitor._getBrowserInfo ? antiCheatMonitor._getBrowserInfo() : {}, 
        });
      } catch (err) {
        console.error("[AntiCheat] Session start failed:", err);
      }
    };

    initBackend();

    // Start frontend monitor
    antiCheatMonitor.start({
      sessionId: sessId,
      round: round || 1,
      api,
      onEvent: (eventType, metadata, res) => {
        if (res) {
          setSuspicionScore(res.suspicionScore);
          setRiskCategory(res.riskCategory);
          setCheatProbability(res.cheatProbability || 0);
          setTrustScore(res.trustScore || 100);
          setExecutionsRestricted(res.executionsRestricted || false);
          
          if (res.warningMessage) {
            setWarningMessage(res.warningMessage);
            setWarningLevel(res.riskCategory);
            setWarningVisible(true);
          }

          if (res.isFrozen) {
            setIsFrozen(true);
            if (onFreeze) onFreeze();
          }
          
          if (res.isDisqualified) {
            setIsDisqualified(true);
            if (onDisqualify) onDisqualify();
            if (onAutoSubmit) onAutoSubmit();
          }
        }
      }
    });

    return () => {
      stopMonitoring("unmount");
    };
  }, [active, api, round, onDisqualify, onAutoSubmit, onFreeze, stopMonitoring]);

  // ── Heartbeat Loop ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!active || !startedRef.current || !sessionId) return;

    const heartbeatInterval = setInterval(async () => {
      try {
        const res = await api.post("/api/anticheat/heartbeat", {
          sessionId,
          tabCount: 1, // Monitor actually handles multi-tab, this is for redundancy
          localStorageIntact: true
        });

        if (res.data) {
          setSuspicionScore(res.data.suspicionScore);
          setRiskCategory(res.data.riskCategory);
          setCheatProbability(res.data.cheatProbability || 0);
          setTrustScore(res.data.trustScore || 100);
          setExecutionsRestricted(res.data.executionsRestricted || false);
          
          if (res.data.isFrozen) setIsFrozen(true);

          if (res.data.isDisqualified && !isDisqualified) {
            setIsDisqualified(true);
            if (onDisqualify) onDisqualify();
            if (onAutoSubmit) onAutoSubmit();
          }
        }
      } catch { }
    }, 10000);

    return () => clearInterval(heartbeatInterval);
  }, [active, sessionId, api, isDisqualified, onDisqualify, onAutoSubmit]);

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
    sessionId,
  };
};

export default useAntiCheat;
