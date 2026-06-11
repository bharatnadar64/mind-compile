// @ts-nocheck
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
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
  const [showProblem, setShowProblem] = useState(true);

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
        const res = await api.get(
          `/api/rounds/number/${Number(problem.round)}`,
        );
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
      const activeRound = rounds.find(
        (r) => Number(r.roundNumber) === roundNumber,
      );
      if (!activeRound || !activeRound.unlocked) {
        navigate("/rounds");
      }
    };
    verifyRoundAccess();
  }, [currentRound, rounds, loadRounds, navigate]);

  // Push a guard history entry and block all back/forward navigation
  useEffect(() => {
    // Push an extra entry so pressing back hits our guard first
    window.history.pushState({ guard: true }, "", window.location.href);

    const handlePopState = (e) => {
      // Always push back to prevent leaving the page
      window.history.pushState({ guard: true }, "", window.location.href);

      if (code && code.trim() && !autoSubmitted.current) {
        const confirmed = window.confirm(
          "You have unsaved code. Do you want to submit and go back?",
        );
        if (confirmed) setNavigationAttempted(true);
      }
    };

    const handleHashChange = (e) => {
      e.preventDefault();
      window.location.hash = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [code]);

  useEffect(() => {
    if (!navigationAttempted) return;
    const submitAndNavigate = async () => {
      if (submitting) return;
      setSubmitting(true);
      let navigated = false;
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
          localStorage.removeItem(
            `timer_${localStorage.getItem("participantId")}_${problem.round}`,
          );
          localStorage.removeItem("currentRound");
          setCode("");
          setOutput("");
          setNavigationAttempted(false);
          if (!isDisqualified) {
            navigated = true;
            navigate("/rounds");
          }
        }
      } catch (err) {
        setOutput(err.response?.data?.error || "Submission failed ❌");
      } finally {
        setNavigationAttempted(false);
        if (!navigated) setSubmitting(false);
      }
    };
    submitAndNavigate();
  }, [
    navigationAttempted,
    api,
    isDisqualified,
    language,
    navigate,
    problem,
    setCode,
    setOutput,
    startTime,
    submitting,
    unlockNextRound,
  ]);

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
      console.log("🚀 Sending request to /api/code/run with:", {
        code,
        language,
        input: problem.input?.[0] || "",
      });
      const res = await api.post("/api/code/run", {
        code,
        language,
        input: problem.input?.[0] || "",
      });
      console.log("📡 Response received:", res);
      console.log("📦 Response data:", res.data);

      const output =
        res.data?.output || res.data?.result?.output || "No output";
      const hasError = res.data?.error || res.data?.status === "error";

      if (hasError) {
        console.error("❌ Error from backend:", res.data?.error);
        setOutput(
          res.data?.error?.message ||
            JSON.stringify(res.data?.error) ||
            "Execution error",
        );
      } else {
        console.log("✅ Output received:", output);
        setOutput(output);
      }

      setExecutionCount((prev) => {
        const next = Math.max(prev - 1, 0);
        localStorage.setItem(
          `run_remaining_${localStorage.getItem("participantId")}_${problem?.round}`,
          String(next),
        );
        return next;
      });
    } catch (err) {
      console.error("🔴 Request failed:", err);
      console.error("Error details:", err.response?.data);
      setOutput(
        err.response?.data?.error || err.message || "Execution failed ❌",
      );
    }
    setRunning(false);
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    stopMonitoring(
      auto ? (isDisqualified ? "disqualified" : "timeout") : "submitted",
    );
    setSubmitting(true);
    let navigated = false;
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
        localStorage.removeItem(
          `timer_${localStorage.getItem("participantId")}_${problem.round}`,
        );
        localStorage.removeItem("currentRound");
        setCode("");
        setOutput("");
        if (!isDisqualified) {
          navigated = true;
          navigate("/rounds");
        }
      }
    } catch (err) {
      setOutput(err.response?.data?.error || "Submission failed ❌");
    } finally {
      if (!navigated) setSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-mono tracking-widest text-xs animate-pulse uppercase">
          Syncing_Problem_Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-300 flex flex-col overflow-hidden h-screen">
      {/* Top Navigation Bar */}
      <div className="h-14 bg-slate-900/90 border-b border-emerald-500/20 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-40 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h1 className="text-sm font-mono font-black text-emerald-400 tracking-tight truncate">
            {"> ./" + problem.title.toLowerCase().replace(/\s+/g, '_')}
          </h1>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black flex-shrink-0 ${
              problem.difficulty === "Easy"
                ? "bg-green-500/20 text-green-400"
                : problem.difficulty === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Center: Trust Index */}
        <div className="flex items-center gap-2 flex-shrink-0 mx-4">
          <span className="text-[9px] font-mono whitespace-nowrap text-slate-400">
            Trust:
          </span>
          <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all ${trustScore > 70 ? "bg-green-500 shadow-lg shadow-green-500/50" : trustScore > 40 ? "bg-yellow-500 shadow-lg shadow-yellow-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"}`}
              style={{ width: `${trustScore}%` }}
            />
          </div>
          <span className="w-8 text-right text-[9px] font-bold text-emerald-400 tabular-nums">
            {trustScore}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              Lang
            </span>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                localStorage.setItem("preferredLanguage", e.target.value);
              }}
              className="bg-slate-800 border border-emerald-500/30 rounded px-2 py-1 text-[10px] font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            >
              <option value="python-3.14">Python</option>
              <option value="g++-15">C++</option>
              <option value="openjdk-25">Java</option>
            </select>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p
              className={`text-lg font-black tabular-nums ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-emerald-400"}`}
            >
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={executionCount <= 0 || running || isFrozen}
              title={`Run tests (${executionCount} remaining)`}
              className={`px-3 py-1.5 rounded font-mono font-black text-[10px] uppercase tracking-widest transition-all ${
                executionCount > 0 && !isFrozen
                  ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed"
              }`}
            >
              ./run_test
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting || !code.trim() || isFrozen}
              className={`px-4 py-1.5 rounded font-mono font-black text-[10px] uppercase tracking-widest transition-all ${
                !submitting && code.trim() && !isFrozen
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed"
              }`}
            >
              {submitting ? "..." : "./submit"}
            </button>
          </div>

          {/* Toggle Problem Panel */}
          <button
            onClick={() => setShowProblem(!showProblem)}
            className="lg:hidden px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors text-xs"
            title="Toggle problem panel"
          >
            {showProblem ? "✕" : "≡"}
          </button>
        </div>
      </div>

      {/* Main Content - Desktop: 3 column, Mobile: 1 column */}
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* Left: Problem Panel (Desktop: 25%, Mobile: Hidden) */}
        {(showProblem || typeof window === "undefined") && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex lg:w-1/4 flex-col border-r border-emerald-500/10 bg-slate-900/40 overflow-hidden"
          >
            {/* Problem Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-3 space-y-3">
                <Problem
                  title={problem.title}
                  difficulty={problem.difficulty}
                  description={problem.description}
                  sampleInput={problem.input?.[0]}
                  sampleOutput={problem.expectedOutput?.[0]}
                />
              </div>
            </div>

            {/* Problem Footer */}
            <div className="border-t border-emerald-500/10 bg-slate-900/80 px-3 py-2 text-[10px] text-slate-500 font-mono flex-shrink-0">
              <div className="flex justify-between items-center gap-2">
                <span>Executions: {executionCount}/3</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-black ${
                    riskCategory === "SAFE"
                      ? "bg-green-500/20 text-green-400"
                      : riskCategory === "SUSPICIOUS"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {riskCategory}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Right: Code Editor & Output (Desktop: 75%, Mobile: 100%) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 lg:w-3/4 flex flex-col overflow-hidden"
        >
          {/* Code Editor Section - 80% */}
          <div
            className={`flex-[5] flex flex-col border-b border-emerald-500/20 relative overflow-hidden ${isFrozen ? "opacity-50" : ""}`}
          >
            {/* Editor Header */}
            <div className="h-10 bg-slate-900/90 border-b border-emerald-500/10 flex items-center px-4 flex-shrink-0 gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Code Editor
                </span>
                <span className="text-[9px] text-slate-600">
                  {code.split("\n").length} lines
                </span>
              </div>
              <span className="text-[9px] text-slate-600 hidden sm:inline">
                {language}
              </span>
            </div>

            {/* Frozen Overlay */}
            <AnimatePresence>
              {isFrozen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl animate-bounce">🔒</div>
                    <h3 className="text-lg font-black text-red-500 tracking-widest">
                      SYSTEM LOCKED
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Suspicious behavior detected
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Screen */}
            <div className="flex-1 overflow-hidden">
              <CodeScreen code={code} setCode={setCode} />
            </div>
          </div>

          {/* Output Section - 30% */}
          <div className="flex-1 flex flex-col bg-black/80 border-t border-emerald-500/20 overflow-hidden">
            {/* Output Header */}
            <div className="h-10 bg-slate-900/90 border-b border-emerald-500/10 flex items-center px-4 flex-shrink-0 gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${output ? "bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" : "bg-slate-600"}`}
                />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Output Terminal
                </span>
              </div>
              {output && (
                <span className="text-[9px] text-emerald-500 font-mono">
                  ✓ Ready
                </span>
              )}
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-hidden min-h-0">
              <Output output={output} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-10 bg-slate-900/90 border-t border-emerald-500/20 px-4 flex items-center justify-between text-[9px] font-mono text-slate-500 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-1 w-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-500 whitespace-nowrap">
            PROCTOR_ACTIVE
          </span>
        </div>

        <span className="text-slate-700 hidden md:inline whitespace-nowrap">
          {sessionId?.slice(0, 10).toUpperCase()}
        </span>
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
