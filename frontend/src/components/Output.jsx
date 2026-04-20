// @ts-nocheck
import React from "react";

const Output = ({ output }) => {
  return (
    <div className="relative w-full h-full group font-mono overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-green-500/5 blur-xl opacity-20 group-hover:opacity-40 transition duration-300 pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* Container */}
      <div
        className="
          relative z-10
          w-full h-full p-4
          bg-black/90 backdrop-blur-sm
          text-green-400
          text-sm sm:text-base
          border border-green-500/30
          rounded-lg
          overflow-y-auto
          shadow-[0_0_20px_rgba(0,255,0,0.15)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 text-xs text-green-500/60">
          <span>{"> output.stream"}</span>
          <span className="animate-pulse">{"> monitoring..."}</span>
        </div>

        {/* Content */}
        <pre className="whitespace-pre-wrap leading-relaxed">
          {output ? (
            <>
              <span className="text-green-300">{"> result:"}</span>
              {"\n"}
              {output}
            </>
          ) : (
            <span className="text-green-600/60 animate-flicker">
              {"> awaiting execution..."}
            </span>
          )}

          {/* cursor */}
          <span className="animate-pulse">█</span>
        </pre>
      </div>

      {/* Bottom scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes scanMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }

          @keyframes flicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; }
            20%, 24%, 55% { opacity: 0.3; }
          }

          .animate-flicker {
            animation: flicker 2.5s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Output;
