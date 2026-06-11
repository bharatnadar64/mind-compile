import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 sm:px-10 lg:px-24">
      {/* ===== ADVANCED BG FX ===== */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-glow" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-500 font-mono text-xs tracking-[0.4em] uppercase">Protocol_Active_v2.1</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-black tracking-tighter leading-[1.1] sm:leading-[0.9]">
              CODE <br />
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 neon-text glitch terminal-cursor"
                data-text="IN THE DARK"
              >
                IN THE DARK
              </span>
            </h1>
            <p className="text-emerald-500/70 text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed font-mono mt-4">
              <span className="text-emerald-400 font-bold">{">"}</span> Precision is your only survival tool. No compiler. No preview. Just you and the machine.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            <Link to="/rounds">
              <button className="neon-button">
                INITIATE_SESSION
              </button>
            </Link>
            <Link to="/rules" className="group flex items-center gap-4 text-slate-500 hover:text-emerald-400 transition-colors tracking-[0.2em] font-black text-sm">
              <span className="w-12 h-[1px] bg-slate-800 group-hover:w-16 group-hover:bg-emerald-500 transition-all" />
              VIEW_PROTOCOL
            </Link>
          </div>
        </motion.div>

        {/* RIGHT VISUAL - TERMINAL WIDGET */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hidden md:block relative perspective-1000 mt-10 lg:mt-0"
        >
          <div className="cyber-card p-0 overflow-hidden border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="terminal-header">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <span>SYSTEM_CORE_STREAM</span>
            </div>
            
            <div className="p-6 font-mono text-sm space-y-4 bg-black/40">
              <div className="flex gap-4">
                <span className="text-emerald-500/40">01</span>
                <span className="text-emerald-400">import <span className="text-cyan-400">{"{ memory, logic }"}</span> from <span className="text-rose-400">"CORE"</span>;</span>
              </div>
              <div className="flex gap-4">
                <span className="text-emerald-500/40">02</span>
                <span className="text-emerald-400">CONST session = NEW HackingProtocol();</span>
              </div>
              <div className="flex gap-4">
                <span className="text-emerald-500/40">03</span>
                <span className="text-emerald-400 animate-pulse">session.bypassFirewall(); // CRITICAL</span>
              </div>
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <span className="text-rose-500/60">WARN</span>
                <span className="text-rose-400">BUFFER_OVERFLOW_DETECTED</span>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-500/60">INFO</span>
                <span className="text-cyan-400 italic">Encrypting data packets... [88%]</span>
              </div>
              
              {/* Fake Data Stream */}
              <div className="grid grid-cols-4 gap-2 pt-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500/40"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating UI Bits */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -right-6 glass-panel p-4 border-emerald-500/30 text-emerald-400 font-mono text-[10px] tracking-widest"
          >
            LATENCY: 12ms <br />
            STATUS: NOMINAL
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Edge */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  );
};

export default Hero;
