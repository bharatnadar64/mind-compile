// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import Problem from "../components/Problem.jsx";
import CodeScreen from "../components/CodeScreen.jsx";
import Output from "../components/Output.jsx";
import { RoundContext } from "../context/ContextProvider.jsx";

const CodenSubmit = () => {
  const [language, setLanguage] = useState("python-3.14");
  const [loading, setLoading] = useState(false);
  const [startedAt, setStartedAt] = useState(null);

  const {
    api,
    problem,
    currentRound,
    code,
    setCode,
    output,
    setOutput,
    executionCount,
    setExecutionCount,
    unlockNextRound,
  } = useContext(RoundContext);

  useEffect(() => {
    if (problem) {
      setStartedAt(new Date());
    }
  }, [problem]);

  const isExecutionAllowed = executionCount > 0;

  // ▶️ RUN (OPTIONAL TEST RUN — ONLY FOR UI PREVIEW)
  const handleRun = async () => {
    if (!isExecutionAllowed) return;

    setLoading(true);
    setOutput("");

    try {
      // ⚠️ OPTIONAL: only preview using first input
      const res = await api.post("/api/submission", {
        problemId: problem._id,
        round: currentRound,
        code,
        language,
        testRun: true, // 🔥 flag (you can ignore in backend if not needed)
      });

      setOutput(res.data.output || "No output");

      setExecutionCount((prev) => prev - 1);
    } catch (err) {
      setOutput("Execution failed ❌");
    }

    setLoading(false);
  };

  // 🚀 FINAL SUBMIT (MAIN LOGIC)
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await api.post("/api/submission", {
        problemId: problem._id,
        round: currentRound,
        code,
        language,
        startedAt, // ✅ REQUIRED
      });

      unlockNextRound(currentRound);

      if (res.data.submission?.isCorrect) {
        setOutput("✅ All test cases passed");
      } else {
        setOutput("❌ Some test cases failed");
      }
    } catch (err) {
      setOutput(err.response?.data?.error || "Submission failed ❌");
    }

    setLoading(false);
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
        Loading problem...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-[95vh] pt-24 px-4 bg-black text-green-400 font-mono">
      {/* LEFT: PROBLEM */}
      <div className="flex-1 h-[95vh] overflow-y-auto">
        <Problem
          title={problem.title}
          difficulty={problem.difficulty}
          description={problem.description}
          sampleInput={problem.inputs?.[0]}
          sampleOutput={problem.expectedOutput?.[0]}
        />
      </div>

      {/* RIGHT: EDITOR */}
      <div className="flex-1 flex flex-col gap-4 h-[95vh]">
        {/* TOOLBAR */}
        <div className="flex items-center gap-3 bg-black/80 border border-green-500/50 rounded px-3 py-2">
          {/* LANGUAGE */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black border border-green-500 px-3 py-2"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python-3.14">Python</option>
            <option value="java">Java</option>
          </select>

          {/* RUN BUTTON */}
          <button
            onClick={handleRun}
            disabled={!isExecutionAllowed || loading}
            className={`px-4 py-2 border ${
              isExecutionAllowed
                ? "border-green-400 hover:bg-green-400 hover:text-black"
                : "border-gray-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Running..." : `Run (${executionCount})`}
          </button>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* CODE EDITOR */}
        <div className="flex-1 border border-green-500 p-2">
          <CodeScreen code={code} setCode={setCode} />
        </div>

        {/* OUTPUT */}
        <div className="flex-1 border border-green-500 p-2 overflow-y-auto">
          <Output output={output} />
        </div>
      </div>
    </div>
  );
};

export default CodenSubmit;
