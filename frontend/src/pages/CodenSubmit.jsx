// @ts-nocheck
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Problem from "../components/Problem.jsx";
import CodeScreen from "../components/CodeScreen.jsx";
import Output from "../components/Output.jsx";
import { RoundContext } from "../context/ContextProvider.jsx";

const CodenSubmit = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("python-3.14");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [startTime, setStartTime] = useState(null); // timestamp (number)
  const [timeLeft, setTimeLeft] = useState(0);

  // ✅ NEW: store the fetched round config (contains timeLimit)
  const [roundConfig, setRoundConfig] = useState(null);

  const autoSubmitted = useRef(false);

  const {
    api,
    problem,
    code,
    setCode,
    output,
    setOutput,
    executionCount,
    setExecutionCount,
    unlockNextRound,
  } = useContext(RoundContext);

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
  }, [problem]);

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
  const handleRun = async () => {
    if (executionCount <= 0) return;

    setRunning(true);
    setOutput("");

    try {
      const res = await api.post("/api/code/run", {
        code,
        language,
        input: problem.input?.[0] || "",
      });

      setOutput(res.data.output || "No output");
      setExecutionCount((p) => p - 1);
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

    setSubmitting(true);

    try {
      await api.post("/api/submission", {
        problemId: problem._id,
        round: problem.round,
        code,
        language,
        startedAt: new Date(startTime),
        submittedAt: new Date(),
        autoSubmitted: auto,
      });

      unlockNextRound(problem.round);

      const key = `timer_${localStorage.getItem("participantId")}_${problem.round}`;
      localStorage.removeItem(key);

      setCode("");
      setOutput("");

      navigate("/rounds");
    } catch (err) {
      setOutput(err.response?.data?.error || "Submission failed ❌");
    }

    setSubmitting(false);
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
    <div className="flex flex-col md:flex-row gap-4 min-h-[95vh] pt-24 px-4 bg-black text-green-400 font-mono">
      {/* LEFT */}
      <div className="flex-1 h-[95vh] overflow-y-auto">
        <Problem
          title={problem.title}
          difficulty={problem.difficulty}
          description={problem.description}
          sampleInput={problem.input?.[0]}
          sampleOutput={problem.expectedOutput?.[0]}
        />
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col gap-4 h-[95vh]">
        {/* TOOLBAR */}
        <div className="flex items-center gap-3 bg-black border border-green-500 px-3 py-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black border border-green-500 px-2 py-1"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python-3.14">Python</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={handleRun}
            disabled={executionCount <= 0 || running}
            className="px-4 py-1 border border-green-400"
          >
            Run ({executionCount})
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting || !code.trim()}
            className="px-4 py-1 bg-blue-500 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {/* TIMER */}
          <div className="ml-auto text-red-400 font-bold text-lg">
            ⏳ {roundConfig ? formatTime(timeLeft) : "Loading..."}
          </div>
        </div>

        {/* CODE */}
        <div className="flex-1 border border-green-500">
          <CodeScreen code={code} setCode={setCode} />
        </div>

        {/* OUTPUT */}
        <div className="flex-1 border border-green-500">
          <Output output={output} />
        </div>
      </div>
    </div>
  );
};

export default CodenSubmit;
