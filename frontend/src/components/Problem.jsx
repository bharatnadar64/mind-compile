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
        return "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
      case "Medium":
        return "border-amber-500/20 text-amber-400 bg-amber-500/5";
      case "Hard":
        return "border-rose-500/20 text-rose-400 bg-rose-500/5";
      default:
        return "border-blue-500/20 text-blue-400 bg-blue-500/5";
    }
  };

  return (
    <div
      className={`relative h-full w-full font-mono text-slate-300 p-3 flex flex-col gap-3 ${className}`}
      style={{ userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-black tracking-tighter text-white uppercase break-all sm:break-normal line-clamp-2">
            {title || "problem_undefined"}
          </h2>
          <span
            className={`px-2 py-0.5 text-[9px] font-black tracking-[0.2em] border rounded-lg uppercase whitespace-nowrap flex-shrink-0 ${getDifficultyStyles()}`}
          >
            {difficulty || "MEDIUM"}
          </span>
        </div>

        {/* Security Alert Tag */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/5 border border-rose-500/20">
          <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-rose-500 text-[9px] font-black tracking-widest uppercase whitespace-nowrap">
            Encryption_Active
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="space-y-1">
          <h3 className="text-[9px] font-black tracking-widest text-emerald-500 uppercase">
            Context
          </h3>
          <div className="text-slate-400 leading-snug text-[12px] font-light whitespace-pre-wrap border-l border-white/5 pl-2 line-clamp-4">
            {description || "Awaiting system data transmission..."}
          </div>
        </div>

        {/* Examples Grid */}
        <div className="grid gap-2 text-[10px]">
          {sampleInput && (
            <div className="space-y-1">
              <h3 className="text-[9px] font-black tracking-widest text-blue-400 uppercase">
                Input
              </h3>
              <div className="bg-white/[0.02] border border-white/5 rounded p-2 font-mono text-[11px] text-slate-300 line-clamp-2">
                {sampleInput}
              </div>
            </div>
          )}

          {sampleOutput && (
            <div className="space-y-1">
              <h3 className="text-[9px] font-black tracking-widest text-purple-400 uppercase">
                Output
              </h3>
              <div className="bg-white/[0.02] border border-white/5 rounded p-2 font-mono text-[11px] text-slate-300 line-clamp-2">
                {sampleOutput}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Footer - Compact */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-[9px] font-mono tracking-widest text-slate-600 uppercase flex-shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-0.5 h-0.5 rounded-full bg-emerald-500" />
          Verified
        </span>
      </div>
    </div>
  );
};

export default Problem;
