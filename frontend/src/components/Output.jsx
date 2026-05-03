// @ts-nocheck
import React from "react";

const Output = ({ output }) => {
  const hasError =
    output?.toLowerCase().includes("error") ||
    output?.toLowerCase().includes("exception");

  return (
    <div className="relative w-full h-full group font-mono overflow-hidden scene-3d">
      {/* Glow background */}
      <div
        className={`absolute inset-0 blur-xl opacity-30 group-hover:opacity-50 transition duration-500 pointer-events-none ${
          hasError
            ? "bg-red-500/5"
            : "bg-gradient-to-br from-green-500/5 to-cyan-500/5"
        }`}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines-fine opacity-10 pointer-events-none" />

      {/* Container */}
      <div
        className={`
          relative z-10
          w-full h-full p-5
          bg-slate-950/90 backdrop-blur-sm
          rounded-lg
          overflow-y-auto
          transition-all duration-300
          depth-panel card-3d
          ${
            hasError
              ? "terminal-border border-red-500/40 text-red-400"
              : "terminal-border-bright text-green-300"
          }
        `}
      >
        {/* Header with status indicator */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/20">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                hasError ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
            <span className="text-xs tracking-widest">
              {hasError ? "⚠ ERROR_LOG" : "→ OUTPUT_STREAM"}
            </span>
          </div>
          <span className="text-xs text-green-600 animate-cyber-pulse">
            {output ? "ACTIVE" : "WAITING"}
          </span>
        </div>

        {/* Content */}
        <pre className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-mono">
          {output ? (
            <>
              <span className={hasError ? "text-red-300" : "text-cyan-400"}>
                {hasError ? "[ERROR]" : "[RESULT]"}
              </span>
              {"\n"}
              <span
                className={hasError ? "text-red-400/90" : "text-green-300/90"}
              >
                {output}
              </span>
            </>
          ) : (
            <span className="text-green-700/70 animate-cyber-pulse">
              ▪ Awaiting compilation output...
            </span>
          )}

          {/* Cursor */}
          <span
            className={`animate-pulse ml-1 ${
              hasError ? "text-red-500" : "text-cyan-400"
            }`}
          >
            _
          </span>
        </pre>
      </div>

      {/* Status footer */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
        <div
          className={`h-full w-1/4 blur-sm ${
            hasError ? "bg-red-500/50" : "bg-green-400/40"
          }`}
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>
    </div>
  );
};

export default Output;
