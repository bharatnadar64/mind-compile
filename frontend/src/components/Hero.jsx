import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const text = "CODE. COMPILE. SURVIVE. NO SECOND CHANCES.";
  const [output, setOutput] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i < text.length) {
      const t = setTimeout(() => {
        setOutput((prev) => prev + text[i]);
        setI(i + 1);
      }, 40);
      return () => clearTimeout(t);
    }
  }, [i]);

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase">SYSTEMS_ACTIVE</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight">
              Master the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 neon-text">
                Blind Code
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Enter the arena of SIESCOMS’ flagship coding battle. No compilers. No debugging. Just pure logic and precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <Link to="/rounds" className="neon-button px-10 py-4 text-lg">
                INITIALIZE_ROUND
              </Link>
              <Link to="/rules" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold tracking-widest text-xs">
                VIEW_PROTOCOL
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Phases</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Compilers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Precision</div>
              </div>
            </div>
          </div>

          {/* Right: Code Visualization */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="w-full glass-panel overflow-hidden border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] group">
              <div className="terminal-header flex justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">kernel_monitor.vpp</div>
              </div>
              
              <div className="p-8 font-mono space-y-4">
                <div className="flex gap-4">
                  <span className="text-slate-700">01</span>
                  <span className="text-emerald-500">class</span>
                  <span className="text-blue-400">MindCompile</span>
                  <span className="text-slate-400">{"{"}</span>
                </div>
                <div className="flex gap-4 pl-8">
                  <span className="text-slate-700">02</span>
                  <span className="text-emerald-500">async function</span>
                  <span className="text-blue-400">initialize</span>
                  <span className="text-slate-400">() {"{"}</span>
                </div>
                <div className="flex gap-4 pl-16">
                  <span className="text-slate-700">03</span>
                  <span className="text-slate-400 text-lg sm:text-xl">
                    {output}
                    <span className="w-2 h-5 bg-emerald-400 inline-block align-middle ml-1 animate-pulse" />
                  </span>
                </div>
                <div className="flex gap-4 pl-8">
                  <span className="text-slate-700">04</span>
                  <span className="text-slate-400">{"}"}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-700">05</span>
                  <span className="text-slate-400">{"}"}</span>
                </div>

                {/* Status Logs */}
                <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 tracking-widest uppercase">Encryption_Link</span>
                    <span className="text-emerald-500">STABLE</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[78%] animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-[10%] w-full animate-[scan_4s_linear_infinite]" />
            </div>

            {/* Floating Orbs */}
            <div className="absolute -top-10 -right-10 w-24 h-24 glass-panel border-emerald-500/20 flex items-center justify-center animate-bounce">
              <span className="text-emerald-400 text-2xl">01</span>
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 glass-panel border-emerald-500/20 flex items-center justify-center animate-[pulse_4s_infinite]">
              <span className="text-blue-400 text-xl font-mono">{"{}"}</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
