// @ts-nocheck
import React, { useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Rounds = () => {
  const { rounds, fetchProblem, loadingRounds } = useContext(RoundContext);
  const navigate = useNavigate();

  if (loadingRounds) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-mono tracking-widest text-xs animate-pulse">BOOTING_ROUND_SELECTOR...</p>
      </div>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="cyber-card max-w-md w-full border-rose-500/30 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">SYSTEM_OFFLINE</h2>
          <p className="text-slate-500 text-sm mb-6">No active rounds found in the central database.</p>
          <button onClick={() => window.location.reload()} className="neon-button w-full">RETRY_CONNECTION</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-20 pt-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow centers */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400 text-[10px] font-bold tracking-[0.4em] uppercase">MISSION_PROTOCOL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">SELECT_PHASE</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            Choose your deployment zone. Each phase increases in complexity and risk. Precision is mandatory.
          </p>
        </div>

        {/* Rounds List */}
        <div className="space-y-6">
          {rounds.map((round, idx) => {
            const isUnlocked = round.unlocked;
            
            return (
              <motion.div
                key={round._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group transition-all duration-500 ${!isUnlocked ? "grayscale pointer-events-none opacity-50" : ""}`}
              >
                <div className={`cyber-card border-white/5 hover:border-emerald-500/30 group-hover:bg-white/[0.03] transition-all
                  ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}
                `}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500
                        ${isUnlocked ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:scale-110" : "bg-white/5 border-white/10 text-slate-600"}
                      `}>
                        <span className="text-2xl font-bold">{round.roundNumber}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{round.name}</h2>
                          {isUnlocked ? (
                            <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black tracking-tighter">UNLOCKED</span>
                          ) : (
                            <span className="text-[8px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-black tracking-tighter">RESTRICTED</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono tracking-widest">
                          <span>⏱ {round.timeLimit} MINUTES_ALLOCATED</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">📂 {round.totalProblems || 0} PROBLEMS_DETECTED</span>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!isUnlocked}
                      onClick={async () => {
                        await fetchProblem(round.roundNumber);
                        navigate("/code-n-submit");
                      }}
                      className={`
                        w-full md:w-auto px-10 py-3 rounded-full font-bold tracking-widest text-xs transition-all duration-300
                        ${isUnlocked 
                          ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                          : "bg-white/5 text-slate-700 border border-white/10"}
                      `}
                    >
                      {isUnlocked ? "DECODE_ENTRY" : "LOCKED_PROTOCOL"}
                    </button>

                  </div>
                </div>

                {/* Decorative progression line */}
                {idx < rounds.length - 1 && (
                  <div className="absolute left-8 -bottom-6 w-[1px] h-6 bg-gradient-to-b from-emerald-500/30 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* System Info */}
        <div className="mt-20 glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-emerald-500/10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-emerald-500 font-mono text-[10px] tracking-widest uppercase mb-1">Status_Report</span>
            <p className="text-white font-bold text-lg">System fully operational.</p>
          </div>
          <div className="h-[1px] w-full md:h-12 md:w-[1px] bg-white/5" />
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-[10px] font-mono tracking-[0.2em] mb-2 uppercase">Integrity_Check</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className={`w-3 h-1 rounded-full ${i < 7 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Rounds;
