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
            <span className="text-emerald-400 text-xs font-bold tracking-[0.3em] uppercase">ACCESS_PROTOCOL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">SYSTEM_RULES</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            Every byte matters. Understand the constraints of the system before initialization.
          </p>
        </div>

        {/* Core Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card border-emerald-500/20 group hover:border-emerald-500/40 transition-all duration-500"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black"
                   style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}>
                01
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">TEAM_CONFIG</h2>
            </div>
            <ul className="space-y-6 font-mono text-xs tracking-[0.2em] text-slate-400">
              <li className="flex gap-4 items-start"><span className="text-emerald-500 font-black mt-1">{">>"}</span> <span>SOLO_PARTICIPATION_REQUIRED</span></li>
              <li className="flex gap-4 items-start"><span className="text-emerald-500 font-black mt-1">{">>"}</span> <span>UNIQUE_HASH_IDENTIFIER_MANDATORY</span></li>
              <li className="flex gap-4 items-start text-rose-500 bg-rose-500/5 p-2 border border-rose-500/10"><span className="text-rose-500 font-black mt-1">{"!!"}</span> <span>COLLABORATION_DETECTED_IMMEDIATE_LOCKOUT</span></li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="cyber-card border-blue-500/20 group hover:border-blue-500/40 transition-all duration-500"
            style={{ clipPath: "polygon(0 15%, 15% 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black"
                   style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}>
                02
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">EXEC_PROTOCOL</h2>
            </div>
            <ul className="space-y-6 font-mono text-xs tracking-[0.2em] text-slate-400">
              <li className="flex gap-4 items-start"><span className="text-blue-500 font-black mt-1">{">>"}</span> <span>EXTERNAL_COMPILER_ACCESS_RESTRICTED</span></li>
              <li className="flex gap-4 items-start"><span className="text-blue-500 font-black mt-1">{">>"}</span> <span>VANILLA_SOURCE_CODE_ONLY</span></li>
              <li className="flex gap-4 items-start text-amber-500 bg-amber-500/5 p-2 border border-amber-500/10"><span className="text-amber-500 font-black mt-1">{"!!"}</span> <span>TIME_COMPRESSION_MODULE_ACTIVE</span></li>
            </ul>
          </motion.div>
        </div>

        {/* Phase Breakdown */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-black text-white mb-10 px-6 border-l-4 border-emerald-500 tracking-[0.2em] uppercase">DEPLOYMENT_PHASES</h2>
          {[
            { id: "01", title: "WARM_START", pts: "10", desc: "Logic calibration phase. Primary system checks.", color: "text-emerald-400" },
            { id: "02", title: "CORE_LOGIC", pts: "20", desc: "Algorithmic synthesis. Zero execution permitted.", color: "text-blue-400" },
            { id: "03", title: "FINAL_SEQUENCE", pts: "30", desc: "Hard logic constraints. Single attempt authorized.", color: "text-rose-400" }
          ].map((phase, idx) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="relative p-6 md:p-10 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
              style={{ clipPath: "polygon(0 0, 97% 0, 100% 25%, 100% 100%, 3% 100%, 0 75%)" }}
            >
              <div className="absolute top-0 right-0 p-6 text-6xl font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors font-mono">
                {phase.id}
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
                <div className="space-y-4">
                  <h3 className={`text-2xl font-black tracking-[0.3em] ${phase.color} uppercase`}>{phase.title}</h3>
                  <p className="text-slate-500 text-sm font-mono tracking-wide max-w-lg leading-relaxed">{phase.desc}</p>
                </div>
                <div className="flex flex-col items-center md:items-end bg-white/[0.03] border border-white/5 p-4 rounded-sm min-w-[140px]">
                  <span className="text-4xl font-black text-white tabular-nums">{phase.pts}</span>
                  <span className="text-[9px] font-mono tracking-[0.3em] text-slate-600 uppercase mt-2">MAX_ALLOCATION</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Danger Alert */}
        <div className="mt-12 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-4">
          <div className="text-rose-500 text-xl pt-1">⚠</div>
          <div className="space-y-1">
            <h4 className="text-rose-500 font-bold text-base tracking-widest">DISQUALIFICATION_WARNING</h4>
            <p className="text-rose-500/70 text-sm leading-relaxed font-mono tracking-tight">
              Anti-cheat heuristics are active. Attempting to switch tabs, resize windows, or open developer tools will trigger an immediate session lockout. No second chances.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Rules;
