// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
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
  const [startedAt, setStartedAt] = useState(null);

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

  // ⏱️ start timer
  useEffect(() => {
    if (problem) setStartedAt(new Date());
  }, [problem]);

  // ❗ Prevent crash
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
        Loading problem...
      </div>
    );
  }

  const isExecutionAllowed = executionCount > 0;

  // ▶️ RUN
  const handleRun = async () => {
    if (!isExecutionAllowed) return;

    setRunning(true);
    setOutput("");

    try {
      const res = await api.post("/api/code/run", {
        code,
        language,
        input: problem.input?.[0] || "",
      });

      setOutput(res.data.output || "No output");
      setExecutionCount((prev) => prev - 1);
    } catch {
      setOutput("Execution failed ❌");
    }

    setRunning(false);
  };
  // 🚀 SUBMIT
  const handleSubmit = async () => {
    const submittedAt = new Date();
    setSubmitting(true);

    try {
      const res = await api.post("/api/submission", {
        problemId: problem._id,
        round: problem.round, // ✅ FIX (you missed this earlier)
        code,
        language,
        startedAt,
        submittedAt,
      });

      unlockNextRound(problem.round);

      setCode("");
      setOutput("");

      navigate("/rounds");
    } catch (err) {
      setOutput(err.response?.data?.error || "Submission failed ❌");
    }

    setSubmitting(false);
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
        {" "}
        Loading problem...{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-[95vh] pt-24 px-4 bg-black text-green-400 font-mono">
      {/* LEFT */}
      <div className="flex-1 h-[95vh] overflow-y-auto">
        <Problem
          title={problem.title}
          difficulty={problem.difficulty}
          description={problem.description}
          sampleInput={problem.input?.[0]} // ✅ FIXED
          sampleOutput={problem.expectedOutput?.[0]}
        />
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col gap-4 h-[95vh]">
        {/* Toolbar */}
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
            disabled={!isExecutionAllowed || running}
            className="px-4 py-1 border border-green-400"
          >
            Run ({executionCount})
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || !code.trim()} // 🔥 ALSO PREVENT EMPTY CODE
            className="px-4 py-1 bg-blue-500 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Code */}
        <div className="flex-1 border border-green-500">
          <CodeScreen code={code} setCode={setCode} />
        </div>

        {/* Output */}
        <div className="flex-1 border border-green-500">
          <Output output={output} />
        </div>
      </div>
    </div>
  );
};

export default CodenSubmit;
