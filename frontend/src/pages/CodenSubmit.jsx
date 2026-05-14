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
        <div className="glass-panel px-6 py-4 border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                localStorage.setItem("preferredLanguage", e.target.value);
              }}
              className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            >
              <option value="g++-15">C++ v15</option>
              <option value="python-3.14">Python v3.14</option>
              <option value="openjdk-25">Java v25</option>
            </select>

            <button
              onClick={handleRun}
              disabled={executionCount <= 0 || running || isFrozen}
              className={`px-4 py-2 rounded-lg border text-[10px] font-black tracking-widest transition-all
                ${executionCount > 0 && !isFrozen 
                  ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" 
                  : "border-white/5 text-slate-600 cursor-not-allowed"}
              `}
            >
              {running ? "RUNNING..." : `EXECUTE (${executionCount})`}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">Remaining_Time</span>
              <span className={`text-xl font-black tracking-tighter tabular-nums ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting || !code.trim() || isFrozen}
              className={`px-8 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase
                ${!submitting && code.trim() && !isFrozen
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:scale-105"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"}
              `}
            >
              {submitting ? "UPLOADING..." : "SUBMIT_DATA"}
            </button>
          </div>
        </div>

        {/* Editor Section */}
        <div className={`flex-[3] glass-panel border-white/5 overflow-hidden relative group ${isFrozen ? "opacity-60" : ""}`}>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20" />
          
          <AnimatePresence>
            {isFrozen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl">❄️</div>
                  <h3 className="text-rose-500 font-black tracking-[0.3em] uppercase">Session_Frozen</h3>
                  <p className="text-slate-500 text-xs max-w-xs font-mono">High risk behavior detected. Manual proctor intervention required for restoration.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-full relative z-10">
            <CodeScreen code={code} setCode={setCode} />
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 glass-panel border-white/5 overflow-hidden">
          <div className="terminal-header py-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-500">SYSTEM_OUTPUT</span>
          </div>
          <div className="h-full">
            <Output output={output} />
          </div>
        </div>
      </motion.div>

      {/* Proctoring Status Bar */}
      <div className="fixed bottom-0 left-0 w-full z-[100] px-6 py-2 glass-panel rounded-none border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-500/80 uppercase">AI_Proctor_Live</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Trust_Index:</span>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${trustScore}%` }}
                className={`h-full ${trustScore > 70 ? 'bg-emerald-500' : trustScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
              />
            </div>
            <span className="text-[10px] font-mono text-white">{trustScore}%</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Threat_Level:</span>
            <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded ${
              riskCategory === "SAFE" ? "text-emerald-400 bg-emerald-400/10" :
              riskCategory === "SUSPICIOUS" ? "text-amber-400 bg-amber-400/10" : "text-rose-400 bg-rose-400/10"
            }`}>
              {riskCategory}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-600">
            SESSION_ID: {sessionId?.slice(0, 12).toUpperCase()}
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
