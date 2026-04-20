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
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* MAIN PANEL */}
      <div className="relative z-10 h-full w-full bg-black/90 backdrop-blur-md border border-green-500/30 rounded-lg shadow-[0_0_40px_rgba(0,255,0,0.15)] p-6 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide drop-shadow-[0_0_12px_#00ff00]">
            {"> "}
            {title || "Problem_Title.sys"}
          </h2>

          <span
            className={`px-3 py-1 text-sm sm:text-base rounded border ${
              difficulty === "Easy"
                ? "border-green-400 text-green-300"
                : difficulty === "Medium"
                  ? "border-yellow-400 text-yellow-300"
                  : "border-red-500 text-red-400"
            }`}
          >
            {difficulty || "MEDIUM"}
          </span>
        </div>

        {/* SECURITY NOTICE */}
        <div className="text-sm text-red-400/80">
          ⚠ copying, external execution, or debugging attempts are monitored
        </div>

        {/* DESCRIPTION */}
        <div className="flex-1 overflow-y-auto text-green-300 text-base sm:text-lg leading-relaxed pr-2">
          <p className="mb-3 text-green-200 text-lg sm:text-xl">
            {"> problem.description"}
          </p>
          {description || "System failed to load description..."}
        </div>

        {/* IO SECTION */}
        <div className="grid sm:grid-cols-2 gap-5">
          {sampleInput && (
            <div className="bg-black/70 border border-green-500/20 rounded p-4">
              <p className="text-green-200 mb-2 text-base sm:text-lg">
                {"> input.stream"}
              </p>
              <pre className="whitespace-pre-wrap text-green-300 text-sm sm:text-base">
                {sampleInput}
              </pre>
            </div>
          )}

          {sampleOutput && (
            <div className="bg-black/70 border border-green-500/20 rounded p-4">
              <p className="text-green-200 mb-2 text-base sm:text-lg">
                {"> expected.output"}
              </p>
              <pre className="whitespace-pre-wrap text-green-300 text-sm sm:text-base">
                {sampleOutput}
              </pre>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between text-sm text-green-500/70 border-t border-green-500/10 pt-3">
          <span>{"> access: read-only"}</span>
          <span>{"> integrity: verified"}</span>
        </div>
      </div>
    </div>
  );
};

export default Problem;
