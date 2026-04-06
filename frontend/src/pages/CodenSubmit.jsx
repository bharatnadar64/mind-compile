// @ts-nocheck
import React, { useContext, useState } from "react";
import Problem from "../components/Problem.jsx";
import CodeScreen from "../components/CodeScreen.jsx";
import Output from "../components/Output.jsx";
import { RoundContext } from "../context/ContextProvider.jsx";

const CodenSubmit = () => {
  const [language, setLanguage] = useState("python-3.14");
  const {
    code,
    setCode,
    output,
    setOutput,
    exampleProblem,
    roundAccess,
    executionCount,
    setExecutionCount,
  } = useContext(RoundContext);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("http://localhost:5000/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input: "" }),
      });

      const data = await res.json();

      if (data.error) {
        setOutput(
          typeof data.error === "string"
            ? data.error
            : JSON.stringify(data.error, null, 2),
        );
      } else if (data.output) {
        setOutput(
          typeof data.output === "string"
            ? data.output
            : JSON.stringify(data.output, null, 2),
        );
      } else {
        setOutput("No output returned");
      }
    } catch (err) {
      setOutput("Error connecting to server");
    }
    setExecutionCount((prev) => prev - 1);
    setLoading(false);
  };

  const handleSubmit = () => {
    setOutput(`Submitting code in ${language}...\n${code}`);
  };

  const isRound1 = roundAccess.round11 || roundAccess.round12;

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-[95vh] pt-24 px-4 bg-black text-green-400 font-mono">
      {/* Left: Problem Statement */}
      <div className="flex-1 h-[95vh] overflow-y-auto">
        <Problem
          {...exampleProblem}
          className="h-full bg-black/90 border border-green-500/50 rounded shadow-[0_0_25px_rgba(0,255,0,0.3)] p-6 flex flex-col"
        />
      </div>

      {/* Right: Code Editor + optional Output */}
      <div className="flex-1 flex flex-col gap-4 h-[95vh]">
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-2 bg-black/80 border border-green-500/50 rounded px-3 py-2 shadow-[0_0_20px_rgba(0,255,0,0.4)]">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black text-green-400 border border-green-500/50 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python-3.14">Python</option>
            <option value="java">Java</option>
          </select>
          {isRound1 && (
            <button
              onClick={handleRun}
              disabled={loading || executionCount < 1}
              className={`px-6 py-2 text-base font-semibold rounded transition-all ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-green-400 text-black hover:bg-green-500 hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]"
              }`}
            >
              {loading ? "Running..." : executionCount < 1 ? "Disabled" : "Run"}
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-base bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(0,150,255,0.6)] transition-all"
          >
            Submit
          </button>
        </div>

        {/* Code Editor */}
        <div
          className={`flex-1 bg-black/90 border border-green-500/50 rounded shadow-[0_0_30px_rgba(0,255,0,0.3)] p-3`}
        >
          <CodeScreen
            code={code}
            setCode={setCode}
            className="bg-black/90 text-green-400 font-mono w-full h-full"
          />
        </div>

        {/* Output only for Round 1 */}
        {isRound1 && (
          <div className="flex-1 bg-black/90 border border-green-500/50 rounded shadow-[0_0_30px_rgba(0,255,0,0.3)] p-4 overflow-y-auto font-mono text-green-400 text-base">
            <Output output={output} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodenSubmit;
