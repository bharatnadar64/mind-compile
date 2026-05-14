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
      className={`relative h-full w-full font-mono text-slate-300 p-8 flex flex-col gap-8 ${className}`}
      style={{ userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">
            {title || "problem_undefined"}
          </h2>
          <span className={`px-4 py-1 text-[10px] font-black tracking-[0.2em] border rounded-lg uppercase ${getDifficultyStyles()}`}>
            {difficulty || "MEDIUM"}
          </span>
        </div>
        
        {/* Security Alert Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/5 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-rose-500 text-[8px] font-black tracking-widest uppercase">Encryption_Active: Copy_Restricted</span>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h3 className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase">Context_Packet</h3>
          <div className="text-slate-400 leading-relaxed text-sm font-light whitespace-pre-wrap border-l border-white/5 pl-6">
            {description || "Awaiting system data transmission..."}
          </div>
        </div>

        {/* Examples Grid */}
        <div className="grid gap-6">
          {sampleInput && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">Input_Sequence</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 font-mono text-xs text-slate-300">
                {sampleInput}
              </div>
            </div>
          )}

          {sampleOutput && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-black tracking-[0.4em] text-purple-400 uppercase">Return_Value</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 font-mono text-xs text-slate-300">
                {sampleOutput}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Footer */}
      <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[8px] font-mono tracking-[0.3em] text-slate-600 uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            Integrity_Level: 100
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            Ref: MC_D_88
          </span>
        </div>
        <div>System: Authoritative</div>
      </div>
    </div>
  );
};

export default Problem;
