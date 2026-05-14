import React from "react";
import { motion } from "framer-motion";

const Rules = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-20 pt-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow centers */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400 text-[10px] font-bold tracking-[0.4em] uppercase">ACCESS_PROTOCOL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">SYSTEM_RULES</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            Every byte matters. Understand the constraints of the system before initialization.
          </p>
        </div>

        {/* Core Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-card border-emerald-500/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                👤
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">team.config</h2>
            </div>
            <ul className="space-y-4 font-mono text-xs tracking-widest text-slate-400">
              <li className="flex gap-3"><span className="text-emerald-500">→</span> SOLO_PARTICIPATION_ONLY</li>
              <li className="flex gap-3"><span className="text-emerald-500">→</span> UNIQUE_IDENTIFIER_MANDATORY</li>
              <li className="flex gap-3 text-rose-500"><span className="text-rose-500">⚠</span> COLLABORATION_DETECTED = LOCKOUT</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cyber-card border-blue-500/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                ⚙️
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">exec.protocol</h2>
            </div>
            <ul className="space-y-4 font-mono text-xs tracking-widest text-slate-400">
              <li className="flex gap-3"><span className="text-blue-500">→</span> NO_COMPILER_ACCESS</li>
              <li className="flex gap-3"><span className="text-blue-500">→</span> NO_EXTERNAL_LIBRARIES</li>
              <li className="flex gap-3 text-amber-500"><span className="text-amber-500">!</span> TIME_COMPRESSION_ACTIVE</li>
            </ul>
          </motion.div>
        </div>

        {/* Phase Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-8 px-4 border-l-4 border-emerald-500">COMPETITION_PHASES</h2>
          {[
            {
              id: "01",
              title: "WARM_START",
              pts: "10",
              desc: "Simple logical puzzles to calibrate your mental compiler.",
              color: "text-emerald-400"
            },
            {
              id: "02",
              title: "CORE_LOGIC",
              pts: "20",
              desc: "Medium difficulty algorithms. No execution permitted.",
              color: "text-blue-400"
            },
            {
              id: "03",
              title: "FINAL_SEQUENCE",
              pts: "30",
              desc: "Hard problem. Single attempt. Precision is the only survival factor.",
              color: "text-purple-400"
            }
          ].map((phase, idx) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="glass-panel p-8 relative overflow-hidden group hover:border-white/20 transition-all"
            >
              <div className="absolute top-0 right-0 p-4 text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                {phase.id}
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className={`text-xl font-bold tracking-widest ${phase.color}`}>{phase.title}</h3>
                  <p className="text-slate-500 text-sm font-light max-w-md">{phase.desc}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-white">{phase.pts}</span>
                  <span className="text-[8px] font-mono tracking-[0.3em] text-slate-600">MAX_PTS_ALLOCATED</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Danger Alert */}
        <div className="mt-12 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-4">
          <div className="text-rose-500 text-xl pt-1">⚠</div>
          <div className="space-y-1">
            <h4 className="text-rose-500 font-bold text-sm tracking-widest">DISQUALIFICATION_WARNING</h4>
            <p className="text-rose-500/70 text-xs leading-relaxed font-mono tracking-tight">
              Anti-cheat heuristics are active. Attempting to switch tabs, resize windows, or open developer tools will trigger an immediate session lockout. No second chances.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Rules;
