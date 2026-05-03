// @ts-nocheck
import React from "react";

const Problem = ({
  title,
  difficulty,
  description,
  sampleInput,
  sampleOutput,
  className = "",
}) => {
  const getDifficultyStyles = () => {
    switch (difficulty) {
      case "Easy":
        return "border-green-400 text-green-300 bg-green-500/10";
      case "Medium":
        return "border-yellow-400 text-yellow-300 bg-yellow-500/10";
      case "Hard":
        return "border-red-500 text-red-400 bg-red-500/10";
      default:
        return "border-cyan-400 text-cyan-300 bg-cyan-500/10";
    }
  };

  return (
    <div
      className={`relative h-[90vh] w-full font-mono text-green-400 overflow-hidden ${className}`}
      style={{ userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (
          (e.ctrlKey && ["c", "x", "u", "s"].includes(e.key.toLowerCase())) ||
          (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")
        ) {
          e.preventDefault();
        }
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-cyan-900/5 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

      {/* MAIN PANEL */}
      <div className="relative z-10 h-full w-full bg-slate-950/90 backdrop-blur-md terminal-border-bright rounded-lg p-6 flex flex-col gap-6 overflow-hidden depth-panel card-3d">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-green-500/30 pb-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-green-300 glow-text">
            <span className="text-cyan-400">&gt;_ </span>
            {title || "problem_undefined"}
          </h2>

          <span
            className={`px-4 py-2 text-xs sm:text-sm font-mono border rounded-md transition-all duration-300 ${getDifficultyStyles()}`}
          >
            [{difficulty || "MEDIUM"}]
          </span>
        </div>

        {/* SECURITY NOTICE */}
        <div className="text-sm text-red-400/90 bg-red-500/10 border border-red-500/30 rounded px-3 py-2 animate-pulse">
          ⚠ [SECURITY_PROTOCOL] copying/debugging attempts logged & monitored
        </div>

        {/* DESCRIPTION */}
        <div className="flex-1 overflow-y-auto text-green-300/90 text-base sm:text-lg leading-relaxed pr-3 space-y-3">
          <p className="text-green-200 text-lg font-bold">
            <span className="text-cyan-400">&gt;</span> PROBLEM DESCRIPTION
          </p>
          <div className="text-green-400/80 whitespace-pre-wrap">
            {description || "System failed to load description..."}
          </div>
        </div>

        {/* IO SECTION */}
        <div className="grid sm:grid-cols-2 gap-4 border-t border-green-500/20 pt-4">
          {sampleInput && (
            <div className="bg-slate-900/60 border border-green-500/30 rounded-lg p-4 hover:border-green-400/50 transition-all duration-300">
              <p className="text-green-200 mb-3 text-sm sm:text-base font-bold">
                <span className="text-cyan-400">&gt; </span>INPUT
              </p>
              <pre className="whitespace-pre-wrap text-green-300/80 text-xs sm:text-sm font-mono bg-slate-950/40 rounded p-2 border border-green-500/10">
                {sampleInput}
              </pre>
            </div>
          )}

          {sampleOutput && (
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-400/50 transition-all duration-300">
              <p className="text-cyan-200 mb-3 text-sm sm:text-base font-bold">
                <span className="text-cyan-400">&gt; </span>EXPECTED OUTPUT
              </p>
              <pre className="whitespace-pre-wrap text-cyan-300/80 text-xs sm:text-sm font-mono bg-slate-950/40 rounded p-2 border border-cyan-500/10">
                {sampleOutput}
              </pre>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between text-xs text-green-500/60 border-t border-green-500/20 pt-3 mt-auto">
          <span className="flex gap-2">
            <span className="text-green-500">●</span>
            <span>read_only: true</span>
          </span>
          <span className="flex gap-2">
            <span>integrity: verified</span>
            <span className="text-green-500">●</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Problem;
