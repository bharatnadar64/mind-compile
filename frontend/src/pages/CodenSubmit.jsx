// @ts-nocheck
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Problem from "../components/Problem.jsx";
import CodeScreen from "../components/CodeScreen.jsx";
import Output from "../components/Output.jsx";
import { RoundContext } from "../context/ContextProvider.jsx";
import useAntiCheat from "../hooks/useAntiCheat.js";
import AntiCheatWarning from "../components/AntiCheatWarning.jsx";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const currentCodeRef = useRef(code);
  useEffect(() => {
    currentCodeRef.current = code;
  }, [code]);

  const onDisqualify = useCallback(() => {
    console.warn("User disqualified by Anti-Cheat system.");
  }, []);

  const onAutoSubmit = useCallback(() => {
    handleSubmit(true);
  }, []);

  const onFreeze = useCallback(() => {}, []);

  const [roundConfig, setRoundConfig] = useState(null);

  const {
    suspicionScore,
    riskCategory,
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
  } = useAntiCheat({
    active: !!problem,
    round: problem?.round,
    api,
    participantId: localStorage.getItem("participantId"),
    onDisqualify,
    onAutoSubmit,
    onFreeze,
    timeLimit: roundConfig?.timeLimit,
  });

  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    if (!problem?.round) return;
    const fetchRoundConfig = async () => {
      try {
        const res = await api.get(`/api/rounds/number/${Number(problem.round)}`);
        setRoundConfig(res.data);
      } catch (err) {
        console.error("Failed to fetch round config:", err);
      }
    };
    fetchRoundConfig();
  }, [problem?.round, api]);

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
      const activeRound = rounds.find((r) => Number(r.roundNumber) === roundNumber);
      if (!activeRound || !activeRound.unlocked) {
        navigate("/rounds");
      }
    };
    verifyRoundAccess();
  }, [currentRound, rounds, loadRounds, navigate]);

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.forward();
      if (code && code.trim() && !autoSubmitted.current) {
        const confirmed = window.confirm("You have unsaved code. Do you want to submit and go back?");
        if (confirmed) setNavigationAttempted(true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [code]);

  useEffect(() => {
    if (!navigationAttempted) return;
    const submitAndNavigate = async () => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const res = await api.post("/api/submission", {
          problemId: problem._id,
          round: problem.round,
          code: (currentCodeRef.current || "").trim() || "// empty payload",
          language,
          startedAt: new Date(startTime),
          submittedAt: new Date(),
          autoSubmitted: true,
        });
        if (res.status === 201) {
          autoSubmitted.current = true;
          await unlockNextRound(problem.round);
          localStorage.removeItem(`timer_${localStorage.getItem("participantId")}_${problem.round}`);
          localStorage.removeItem("currentRound");
          setCode("");
          setOutput("");
          setNavigationAttempted(false);
          if (!isDisqualified) navigate("/rounds");
        }
      } catch (err) {
        setOutput(err.response?.data?.error || "Submission failed ❌");
        setNavigationAttempted(false);
        setSubmitting(false);
      }
    };
    submitAndNavigate();
  }, [navigationAttempted, api, isDisqualified, language, navigate, problem, setCode, setOutput, startTime, submitting, unlockNextRound]);

  useEffect(() => {
    if (!problem) return;
    const key = `timer_${localStorage.getItem("participantId")}_${problem.round}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setStartTime(Number(saved));
    } else {
      const now = Date.now();
      localStorage.setItem(key, String(now));
      setStartTime(now);
    }
    autoSubmitted.current = false;
    const handleBeforeUnload = (e) => {
      if (code && code.trim() && !autoSubmitted.current) {
        e.preventDefault();
        e.returnValue = "Unsaved code detected.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [problem, code]);

  useEffect(() => {
    const timeLimit = roundConfig?.timeLimit;
    if (!timeLimit || !startTime) return;
    const durationMs = Number(timeLimit) * 60 * 1000;
    const interval = setInterval(() => {
      const remaining = durationMs - (Date.now() - startTime);
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
  }, [startTime, roundConfig?.timeLimit]);

  const formatTime = (s) => {
    if (!Number.isFinite(s) || s < 0) return "00:00";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleRun = async () => {
    if (executionCount <= 0 || running || isFrozen || isDisqualified) return;
    if (executionsRestricted) {
      setOutput("⚠️ EXECUTION_RESTRICTED: Suspicious behavior detected.");
      return;
    }
    setRunning(true);
    setOutput("");
    try {
      const res = await api.post("/api/code/run", { code, language, input: problem.input?.[0] || "" });
      setOutput(res.data.output || "No output");
      setExecutionCount((prev) => {
        const next = Math.max(prev - 1, 0);
        localStorage.setItem(`run_remaining_${localStorage.getItem("participantId")}_${problem?.round}`, String(next));
        return next;
      });
    } catch {
      setOutput("Execution failed ❌");
    }
    setRunning(false);
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    stopMonitoring(auto ? (isDisqualified ? "disqualified" : "timeout") : "submitted");
    setSubmitting(true);
    try {
      const res = await api.post("/api/submission", {
        problemId: problem._id,
        round: problem.round,
        code: (currentCodeRef.current || "").trim() || "// empty payload",
        language,
        startedAt: new Date(startTime),
        submittedAt: new Date(),
        autoSubmitted: auto,
      });
      if (res.status === 201) {
        autoSubmitted.current = true;
        await unlockNextRound(problem.round);
        localStorage.removeItem(`timer_${localStorage.getItem("participantId")}_${problem.round}`);
        localStorage.removeItem("currentRound");
        setCode("");
        setOutput("");
        if (!isDisqualified) navigate("/rounds");
      }
    } catch (err) {
      setOutput(err.response?.data?.error || "Submission failed ❌");
      setSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-mono tracking-widest text-xs animate-pulse uppercase">Syncing_Problem_Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pt-20 pb-10 px-4 sm:px-6 relative overflow-hidden flex flex-col lg:flex-row gap-6">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Left: Problem Description */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-2/5 flex flex-col gap-6 h-[calc(100vh-120px)] lg:h-[85vh]"
      >
        <div className="glass-panel h-full overflow-y-auto border-white/5 shadow-2xl custom-scrollbar">
          <Problem
            title={problem.title}
            difficulty={problem.difficulty}
            description={problem.description}
            sampleInput={problem.input?.[0]}
            sampleOutput={problem.expectedOutput?.[0]}
          />
        </div>
      </motion.div>

      {/* Right: Workspace */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-3/5 flex flex-col gap-6 h-[calc(100vh-120px)] lg:h-[85vh]"
      >
        {/* Workspace Toolbar */}
        <div className="glass-panel px-6 py-4 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6" style={{ clipPath: "polygon(0 0, 98% 0, 100% 30%, 100% 100%, 2% 100%, 0 70%)" }}>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-500 tracking-[0.2em] mb-1 uppercase">ENV_PARAMETER</span>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  localStorage.setItem("preferredLanguage", e.target.value);
                }}
                className="bg-slate-900 border border-white/10 rounded-sm px-4 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="g++-15">CPP_v15_NODE</option>
                <option value="python-3.14">PY_v3.14_NODE</option>
                <option value="openjdk-25">JAVA_v25_NODE</option>
              </select>
            </div>

            <div className="h-10 w-px bg-white/5" />

            <button
              onClick={handleRun}
              disabled={executionCount <= 0 || running || isFrozen}
              className={`px-8 py-2 text-xs font-black tracking-widest transition-all
                ${executionCount > 0 && !isFrozen 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" 
                  : "bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed"}
              `}
              style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
            >
              {running ? "EXECUTING..." : `RUN_TEST [${executionCount}]`}
            </button>
          </div>

          <div className="flex items-center gap-8 w-full sm:w-auto">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">TIME_TILL_EXPIRY</span>
              <span className={`text-2xl font-black tracking-tighter tabular-nums leading-none mt-1 ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting || !code.trim() || isFrozen}
              className={`px-10 py-3 text-xs font-black tracking-widest transition-all uppercase
                ${!submitting && code.trim() && !isFrozen
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"}
              `}
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)" }}
            >
              {submitting ? "UPLOADING..." : "COMMIT_ENTRY"}
            </button>
          </div>
        </div>

        {/* Editor Section */}
        <div className={`flex-[3] cyber-card p-0 border-white/10 relative group ${isFrozen ? "opacity-60" : ""}`}>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:100%_8px] opacity-20" />
          
          <AnimatePresence>
            {isFrozen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
              >
                <div className="text-center space-y-4">
                  <div className="text-5xl">🔒</div>
                  <h3 className="text-rose-500 text-2xl font-black tracking-[0.3em] uppercase">SYSTEM_LOCKED</h3>
                  <p className="text-slate-500 text-sm max-w-xs font-mono leading-relaxed">Behavioral integrity failure detected. Node connection terminated by AI proctor.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-full relative z-10 overflow-hidden">
            <CodeScreen code={code} setCode={setCode} />
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 cyber-card p-0 border-white/10 overflow-hidden bg-black/20">
          <div className="terminal-header py-3">
            <span className="text-[10px] font-mono tracking-[0.3em] text-emerald-500/60 uppercase">NODE_OUTPUT_FEED</span>
          </div>
          <div className="h-full">
            <Output output={output} />
          </div>
        </div>
      </motion.div>

      {/* Proctoring Status Bar */}
      <div className="fixed bottom-0 left-0 w-full z-[100] px-6 py-4 glass-panel rounded-none border-t border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black font-mono tracking-[0.3em] text-emerald-500 uppercase">PROCTOR_ACTIVE</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">TRUST_INDEX:</span>
            <div className="w-48 h-1 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${trustScore}%` }}
                className={`h-full transition-all duration-1000 ${trustScore > 70 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : trustScore > 40 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`}
              />
            </div>
            <span className="text-xs font-mono font-bold text-white tabular-nums">{trustScore}%</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">RISK_LEVEL:</span>
            <span className={`text-[10px] font-black tracking-[0.3em] px-3 py-1 rounded-sm border ${
              riskCategory === "SAFE" ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" :
              riskCategory === "SUSPICIOUS" ? "text-amber-400 border-amber-500/40 bg-amber-500/10" : "text-rose-400 border-rose-500/40 bg-rose-500/10"
            }`}>
              {riskCategory}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-700 tracking-widest hidden lg:block">
            NODE_SESSION: {sessionId?.slice(0, 16).toUpperCase()}
          </div>
        </div>
      </div>

      <AntiCheatWarning
        visible={warningVisible}
        message={warningMessage}
        level={warningLevel}
        onDismiss={dismissWarning}
      />
    </div>
  );
};

export default CodenSubmit;
