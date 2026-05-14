// @ts-nocheck
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Problem from "../components/Problem.jsx";
import CodeScreen from "../components/CodeScreen.jsx";
import Output from "../components/Output.jsx";
import { RoundContext } from "../context/ContextProvider.jsx";
import useAntiCheat from "../hooks/useAntiCheat.js";

const CodenSubmit = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("python-3.14");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [navigationAttempted, setNavigationAttempted] = useState(false);

  const {
    api,
    rounds,
    loadRounds,
    problem,
    code,
    setCode,
    output,
    setOutput,
    executionCount,
    setExecutionCount,
    unlockNextRound,
    currentRound,
  } = useContext(RoundContext);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const currentCodeRef = useRef(code);

  // Keep ref updated with latest code
  useEffect(() => {
    currentCodeRef.current = code;
  }, [code]);

  // ── ANTI-CHEAT INTEGRATION ───────────────────────────────────────────────
  const {
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
  } = useAntiCheat({
    active: !!problem,
    round: problem?.round,
    api,
    participantId: localStorage.getItem("participantId"),
    onDisqualify: () => {
      console.warn("User disqualified by Anti-Cheat system.");
    },
    onAutoSubmit: () => {
      handleSubmit(true);
    },
    onFreeze: () => {
      // Editor should freeze automatically via the 'isFrozen' prop/state
    },
  });

  const [startTime, setStartTime] = useState(null); // timestamp (number)
  const [timeLeft, setTimeLeft] = useState(0);

  // ✅ NEW: store the fetched round config (contains timeLimit)
  const [roundConfig, setRoundConfig] = useState(null);

  const autoSubmitted = useRef(false);

  // =========================================
  // ✅ FETCH ROUND CONFIG (to get timeLimit)
  // =========================================
  useEffect(() => {
    if (!problem?.round) return;

    const fetchRoundConfig = async () => {
      try {
        const res = await api.get(
          `/api/rounds/number/${Number(problem.round)}`,
        );
        setRoundConfig(res.data);
      } catch (err) {
        console.error("Failed to fetch round config:", err);
      }
    };

    fetchRoundConfig();
  }, [problem?.round]);

  // =========================================
  // � REDIRECT IF ROUND IS NO LONGER ACCESSIBLE
  // =========================================
  useEffect(() => {
    const verifyRoundAccess = async () => {
      const savedRound = localStorage.getItem("currentRound");

      if (!currentRound && !savedRound) {
        navigate("/rounds");
        return;
      }

      if (rounds.length === 0) {
        await loadRounds();
        return;
      }

      const roundNumber = Number(currentRound || savedRound);
      const activeRound = rounds.find(
        (r) => Number(r.roundNumber) === roundNumber,
      );

      if (!activeRound || !activeRound.unlocked) {
        navigate("/rounds");
      }
    };

    verifyRoundAccess();
  }, [currentRound, rounds, loadRounds, navigate]);

  // =========================================
  // �🔙 HANDLE BROWSER BACK NAVIGATION
  // =========================================
  useEffect(() => {
    const handlePopState = (e) => {
      // Prevent default back navigation
      e.preventDefault();
      window.history.forward();

      // Show confirmation dialog only if there's unsaved code
      if (code && code.trim() && !autoSubmitted.current) {
        const confirmed = window.confirm(
          "You have unsaved code. Do you want to submit and go back?",
        );

        if (confirmed) {
          setNavigationAttempted(true); // Trigger submission
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [code]);

  // =========================================
  // 🔄 TRIGGER SUBMISSION ON NAVIGATION ATTEMPT
  // =========================================
  useEffect(() => {
    if (!navigationAttempted) return;

    const submitAndNavigate = async () => {
      if (submitting) return;
      setSubmitting(true);

      try {
        const submissionData = {
          problemId: problem._id,
          round: problem.round,
          code: (currentCodeRef.current || "").trim() || "// empty payload",
          language,
          startedAt: new Date(startTime),
          submittedAt: new Date(),
          autoSubmitted: true,
        };

        const res = await api.post("/api/submission", submissionData);

        if (res.status === 201) {
          autoSubmitted.current = true;
          await unlockNextRound(problem.round);

          const key = `timer_${localStorage.getItem("participantId")}_${problem.round}`;
          localStorage.removeItem(key);
          localStorage.removeItem("currentRound");

          setCode("");
          setOutput("");
          setNavigationAttempted(false);

          navigate("/rounds");
        }
      } catch (err) {
        console.error("Submit error:", err);
        setOutput(err.response?.data?.error || "Submission failed ❌");
        setNavigationAttempted(false);
        setSubmitting(false);
      }
    };

    submitAndNavigate();
  }, [navigationAttempted]);

  // =========================================
  // ⏱️ INIT TIMER (PERSISTENT FIXED)
  // =========================================
  useEffect(() => {
    if (!problem) return;

    const key = `timer_${localStorage.getItem("participantId")}_${problem.round}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      console.log(saved);
      setStartTime(Number(saved)); // 🔥 IMPORTANT
    } else {
      const now = Date.now();
      localStorage.setItem(key, String(now));
      setStartTime(now);
    }

    autoSubmitted.current = false;

    // ✅ CONFIRMATION POPUP WHEN LEAVING PAGE
    const handleBeforeUnload = (e) => {
      if (code && code.trim() && !autoSubmitted.current) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved code. If you leave, it will be auto-submitted.";
        return "You have unsaved code. If you leave, it will be auto-submitted.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [problem, navigate, code]);

  // =========================================
  // ⏳ TIMER LOOP
  // =========================================
  useEffect(() => {
    // ✅ Use roundConfig.timeLimit instead of problem.timeLimit
    const timeLimit = roundConfig?.timeLimit;
    console.log("timeLimit:", timeLimit, typeof timeLimit);
    if (!timeLimit || !startTime) return;

    const durationMs = Number(timeLimit) * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = durationMs - elapsed;

      console.log("remaining:", remaining);

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);

        if (!autoSubmitted.current) {
          autoSubmitted.current = true;
          handleSubmit(true);
        }

        return;
      }

      setTimeLeft(Math.floor(remaining / 1000));
    }, 1000);

    return () => clearInterval(interval);
    // ✅ Depend on roundConfig.timeLimit, not problem.timeLimit
  }, [startTime, roundConfig?.timeLimit]);

  // =========================================
  // 🧮 FORMAT TIME
  // =========================================
  const formatTime = (s) => {
    if (!Number.isFinite(s) || s < 0) return "0:00";

    const m = Math.floor(s / 60);
    const sec = s % 60;

    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // =========================================
  // ▶️ RUN
  // =========================================
  const getExecutionStorageKey = () => {
    const participantId = localStorage.getItem("participantId") || "guest";
    return `run_remaining_${participantId}_${problem?.round}`;
  };

  const handleRun = async () => {
    if (executionCount <= 0 || isFrozen || isDisqualified) return;

    if (executionsRestricted) {
      setOutput("⚠️ EXECUTION RESTRICTED: Suspicious behavior detected. Execution is temporarily disabled.");
      return;
    }

    setRunning(true);
    setOutput("");

    try {
      const res = await api.post("/api/code/run", {
        code,
        language,
        input: problem.input?.[0] || "",
      });

      setOutput(res.data.output || "No output");
      setExecutionCount((prev) => {
        const next = Math.max(prev - 1, 0);
        localStorage.setItem(getExecutionStorageKey(), String(next));
        return next;
      });
    } catch {
      setOutput("Execution failed ❌");
    }

    setRunning(false);
  };

  // =========================================
  // 🚀 SUBMIT (MANUAL + AUTO)
  // =========================================
  const handleSubmit = async (auto = false) => {
    if (submitting) return;

    // Stop anti-cheat monitoring on submission
    stopMonitoring(auto ? (isDisqualified ? "disqualified" : "timeout") : "submitted");

    setSubmitting(true);

    try {
      const submissionData = {
        problemId: problem._id,
        round: problem.round,
        code: (currentCodeRef.current || "").trim() || "// empty payload",
        language,
        startedAt: new Date(startTime),
        submittedAt: new Date(),
        autoSubmitted: auto,
      };

      console.log("Submitting:", submissionData);

      const res = await api.post("/api/submission", submissionData);

      console.log("Submission response:", res);

      if (res.status === 201) {
        console.log("Submission successful!");
        autoSubmitted.current = true;
        await unlockNextRound(problem.round);

        const key = `timer_${localStorage.getItem("participantId")}_${problem.round}`;
        localStorage.removeItem(key);
        localStorage.removeItem("currentRound");

        setCode("");
        setOutput("");

        navigate("/rounds");
      }
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.error || "Submission failed ❌";
      setOutput(errorMsg);
      setSubmitting(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
        Loading problem...
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================
  return (
    <div className="relative flex flex-col md:flex-row gap-4 min-h-[95vh] pt-24 px-4 bg-black text-green-400 font-mono overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 pointer-events-none" />

      {/* LEFT — PROBLEM */}
      <div className="flex-1 h-[95vh] overflow-y-auto">
        <Problem
          title={problem.title}
          difficulty={problem.difficulty}
          description={problem.description}
          sampleInput={problem.input?.[0]}
          sampleOutput={problem.expectedOutput?.[0]}
        />
      </div>

      {/* RIGHT — EXECUTION PANEL */}
      <div className="flex-1 flex flex-col gap-4 h-[95vh]">
        {/* 🔥 TOOLBAR */}
        <div className="relative flex items-center gap-3 bg-black/80 backdrop-blur-md border border-green-500/30 px-4 py-3 rounded">
          {/* scanlines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:100%_3px]" />

          {/* language */}
          <select
            value={language}
            onChange={(e) => {
              const newLanguage = e.target.value;
              setLanguage(newLanguage);
              localStorage.setItem("preferredLanguage", newLanguage);
            }}
            className="relative bg-black border border-green-500 px-3 py-1 text-sm focus:outline-none"
          >
            <option value="g++-15">C</option>
            <option value="g++-15">C++</option>
            <option value="python-3.14">Python</option>
            <option value="openjdk-25">Java</option>
          </select>

          {/* run */}
          <button
            onClick={handleRun}
            disabled={executionCount <= 0 || running}
            className={`
            relative px-4 py-1 border text-sm transition-all duration-200
            ${executionCount > 0
                ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-black shadow-[0_0_10px_rgba(0,255,0,0.3)]"
                : "border-green-500/20 text-green-500/40 cursor-not-allowed"
              }
          `}
          >
            {running ? "> running..." : `> run (${executionCount})`}
          </button>

          {/* submit */}
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || !code.trim()}
            className={`
            relative px-4 py-1 text-sm transition-all duration-200
            ${submitting
                ? "bg-blue-500/50"
                : "bg-blue-500 hover:bg-blue-400 text-black shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              }
          `}
          >
            {submitting ? "> submitting..." : "> submit"}
          </button>

          {/* TIMER — 🔥 IMPORTANT */}
          <div className="ml-auto text-red-400 font-bold text-lg sm:text-xl tracking-wider animate-pulse">
            ⏳ {roundConfig ? formatTime(timeLeft) : "loading..."}
          </div>
        </div>

        {/* CODE */}
        <div className={`flex-1 border border-green-500/30 rounded overflow-hidden relative ${isFrozen ? "opacity-60 pointer-events-none grayscale" : ""}`}>
          {isFrozen && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="text-red-500 font-bold tracking-tighter text-xl sm:text-2xl animate-pulse">
                [ ACCESS_DENIED: EDITOR_FROZEN ]
              </div>
            </div>
          )}
          <CodeScreen code={code} setCode={setCode} />
        </div>

        {/* OUTPUT */}
        <div className="flex-1 border border-green-500/30 rounded overflow-hidden">
          <Output output={output} />
        </div>
      </div>

      {/* 🔥 GLOBAL SCAN BAR */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>

      {/* Animations */}
      <style>
        {`
        @keyframes scanMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}
      </style>

      {/* ── ANTI-CHEAT WARNING OVERLAY ─────────────────────────────────────── */}
      {warningVisible && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className={`
            max-w-md w-full border p-6 rounded shadow-2xl transition-all transform scale-100
            ${warningLevel === "CONFIRMED" ? "border-red-500 bg-red-950/20 shadow-red-500/20" :
              warningLevel === "DOUBTFUL" ? "border-orange-500 bg-orange-950/20 shadow-orange-500/20" :
                "border-yellow-500 bg-yellow-950/20 shadow-yellow-500/20"}
          `}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-2xl ${warningLevel === "CONFIRMED" ? "text-red-500" :
                warningLevel === "DOUBTFUL" ? "text-orange-500" : "text-yellow-500"}`}>
                {warningLevel === "CONFIRMED" ? "🚨" : warningLevel === "DOUBTFUL" ? "⚠️" : "ℹ️"}
              </div>
              <h3 className={`text-lg font-bold tracking-widest ${warningLevel === "CONFIRMED" ? "text-red-400" :
                warningLevel === "DOUBTFUL" ? "text-orange-400" : "text-yellow-400"}`}>
                {warningLevel === "CONFIRMED" ? "DISQUALIFIED" :
                  warningLevel === "DOUBTFUL" ? "CRITICAL WARNING" : "BEHAVIORAL ALERT"}
              </h3>
            </div>

            <p className="text-green-300/90 text-sm mb-6 leading-relaxed">
              {warningMessage}
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] text-green-500/40 mb-1">
                <span>RISK_SCORE: {suspicionScore}</span>
                <span>CONFIDENCE: {cheatProbability}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${warningLevel === "CONFIRMED" ? "bg-red-500" :
                  warningLevel === "DOUBTFUL" ? "bg-orange-500" : "bg-yellow-500"}`}
                  style={{ width: `${Math.min(100, suspicionScore)}%` }} />
              </div>
            </div>

            {warningLevel !== "CONFIRMED" && (
              <button
                onClick={dismissWarning}
                className="mt-6 w-full py-2 border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-all text-sm font-bold tracking-widest"
              >
                {">"} I UNDERSTAND
              </button>
            )}

            {warningLevel === "CONFIRMED" && (
              <button
                onClick={() => navigate("/rounds")}
                className="mt-6 w-full py-2 bg-red-600 text-white hover:bg-red-700 transition-all text-sm font-bold tracking-widest"
              >
                {">"} RETURN TO LOBBY
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── LIVE ANTI-CHEAT STATUS BAR ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 py-1 bg-black/60 backdrop-blur-sm border-t border-green-500/10 flex justify-between items-center text-[10px] sm:text-xs">
        <div className="flex gap-4">
          <span className="text-green-500/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            PROCTORING_ACTIVE
          </span>
          <span className={`${riskCategory === "SAFE" ? "text-green-500/40" :
            riskCategory === "SUSPICIOUS" ? "text-yellow-400" :
              riskCategory === "DOUBTFUL" ? "text-orange-400" : "text-red-500"}`}>
            RISK: {riskCategory} ({suspicionScore})
          </span>
          <span className="text-green-500/40 hidden sm:inline">
            TRUST_SCORE: {trustScore}%
          </span>
        </div>
        <div className="text-green-500/30 font-mono">
          SID: {sessionId?.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
};

export default CodenSubmit;
