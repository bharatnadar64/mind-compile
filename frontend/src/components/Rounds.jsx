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
            <span className="text-emerald-400 text-xs font-bold tracking-[0.3em] uppercase">MISSION_PROTOCOL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">SELECT_PHASE</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            Choose your deployment zone. Each phase increases in complexity and risk. Precision is mandatory.
          </p>
        </div>

        {/* Rounds List */}
        <div className="space-y-8">
          {rounds.map((round, idx) => {
            const isUnlocked = round.unlocked;
            
            return (
              <motion.div
                key={`${round._id}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group transition-all duration-500 ${!isUnlocked ? "grayscale-[0.8] opacity-60" : ""}`}
              >
                {/* Decorative progression line */}
                {idx < rounds.length - 1 && (
                  <div className="absolute left-10 -bottom-8 w-[2px] h-8 bg-gradient-to-b from-emerald-500/30 to-transparent z-0" />
                )}

                <div className={`cyber-card border-emerald-500/10 hover:border-emerald-500/40 group-hover:bg-emerald-500/[0.02] transition-all
                  ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}
                `}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-2 transition-all duration-500 font-mono
                        ${isUnlocked ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-white/5 border-white/10 text-slate-700"}
                      `} style={{ clipPath: "polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)" }}>
                        <span className="text-3xl font-black">{round.roundNumber.toString().padStart(2, '0')}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className={`text-2xl font-black tracking-tight transition-colors ${isUnlocked ? "text-white group-hover:text-emerald-400" : "text-slate-600"}`}>
                            {round.name.toUpperCase()}
                          </h2>
                          {isUnlocked ? (
                            <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-[10px] font-black text-emerald-400 tracking-widest animate-pulse">
                              LIVE_DEPLOYMENT
                            </div>
                          ) : (
                            <div className="px-2 py-0.5 bg-slate-800/50 border border-white/5 rounded text-[10px] font-black text-slate-500 tracking-widest">
                              ENCRYPTED
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-mono tracking-widest">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500/60">⏱</span>
                            <span>{round.timeLimit}m_ALLOCATED</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500/60">📂</span>
                            <span>{round.totalProblems || 0}p_DETECTED</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!isUnlocked}
                      onClick={async () => {
                        await fetchProblem(round.roundNumber);
                        navigate("/code-n-submit");
                      }}
                      className={isUnlocked ? "neon-button scale-95 sm:scale-100 w-full md:w-auto" : "px-8 py-4 border border-white/5 text-slate-700 font-black text-sm tracking-widest bg-white/5 cursor-not-allowed w-full md:w-auto"}
                      style={!isUnlocked ? { clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" } : {}}
                    >
                      {isUnlocked ? "INIT_DECODE" : "AUTH_REQUIRED"}
                    </button>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* System Info */}
        <div className="mt-20 glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-emerald-500/10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-emerald-500 font-mono text-xs tracking-widest uppercase mb-1">Status_Report</span>
            <p className="text-white font-bold text-lg">System fully operational.</p>
          </div>
          <div className="h-[1px] w-full md:h-12 md:w-[1px] bg-white/5" />
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-xs font-mono tracking-[0.2em] mb-2 uppercase">Integrity_Check</p>
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
