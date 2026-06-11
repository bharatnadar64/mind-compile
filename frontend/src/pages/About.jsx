import React from "react";

const About = () => {
  return (
    <>
      <section className="min-h-screen bg-black text-green-400 font-mono px-6 sm:px-10 lg:px-20 relative overflow-hidden py-16">
        {/* Background scanlines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
          }}
        />

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,0,0.08),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-20">
          {/* ───── About Section ───── */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 lg:pr-12">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black tracking-widest text-emerald-400 glitch"
                data-text="> ./info --about"
              >
                {"> ./info --about"}<span className="terminal-cursor"></span>
              </h1>

              <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed">
                MindCompile is{" "}
                <strong className="text-emerald-400">
                  SIESCOMS' flagship blind coding event
                </strong>
                , designed to test logic, precision, and problem-solving under
                pressure. Unlike regular coding competitions, participants must
                write error-free code without running or debugging, relying
                entirely on their understanding of concepts and syntax.
              </p>

              <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed">
                Across three intense rounds, only those with real coding skills
                will succeed. Vibecoders won't survive. MindCompile is where
                every line of code matters, and only true programmers rise to the
                challenge.
              </p>
            </div>

            {/* ───── Event In-Charge ───── */}
            <div className="space-y-6 lg:pl-12">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black tracking-widest text-emerald-400 glitch"
                data-text="> ./team --lead"
              >
                {"> ./team --lead"}
              </h2>

              <div className="cyber-card relative overflow-hidden group">
                {/* Accent glow bar */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-emerald-500/20 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-4">
                  {/* Initials badge */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-black tracking-wider shadow-lg shadow-emerald-500/10">
                    BN
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-emerald-400 text-lg sm:text-xl lg:text-2xl tracking-wide font-black">
                      Bharat Nadar
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/70 font-bold mt-0.5">
                      Lead · Full-Stack Architect · Event Head
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    The architect behind MindCompile's entire infrastructure —
                    from the real-time anti-cheat proctoring engine to the
                    blind-coding evaluation pipeline. Bharat designed and built
                    the full-stack platform, ensuring every round is intense,
                    fair, and tamper-proof.
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Under his leadership, MindCompile evolved from a concept into
                    SIESCOMS' most technically advanced competitive coding event,
                    where only real programmers thrive.
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-emerald-500/10 rounded-br-lg pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ───── The Team ───── */}
          <div className="space-y-10 pt-10 border-t border-emerald-500/10">
            <div className="text-center space-y-2">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black tracking-widest text-emerald-400 glitch"
                data-text="> ./team --all"
              >
                {"> ./team --all"}
              </h2>
              <p className="text-emerald-500/50 text-xs sm:text-sm tracking-[0.2em] font-mono uppercase">
                // System Architects & Engineers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Bharat Nadar */}
              <div className="cyber-card relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02]">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-emerald-500/20 opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-black tracking-wider shadow-lg shadow-emerald-500/10">
                    BN
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-emerald-400 text-lg sm:text-xl tracking-wide font-black">
                      Bharat Nadar
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/70 font-bold mt-0.5">
                      Full-Stack Architect · Event Lead
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    The architect behind MindCompile's entire infrastructure —
                    from the real-time anti-cheat proctoring engine to the
                    blind-coding evaluation pipeline. Bharat designed and built
                    the full-stack platform, ensuring every round is intense,
                    fair, and tamper-proof.
                  </p>
                </div>

                {/* Role tag */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Full-Stack
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Backend
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Frontend
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-emerald-500/10 rounded-br-lg pointer-events-none" />
              </div>

              {/* Sreedharsan Nadar */}
              <div className="cyber-card relative overflow-hidden group transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/[0.02]">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-cyan-500/20 opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-black tracking-wider shadow-lg shadow-cyan-500/10">
                    SN
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-cyan-400 text-lg sm:text-xl tracking-wide font-black">
                      Sreedharsan Nadar
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 font-bold mt-0.5">
                      Database Designer & Engineer
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    The data backbone of MindCompile. Sreedharsan architected
                    the database schemas, optimized query pipelines, and
                    engineered the storage layer that powers real-time
                    leaderboards, submission tracking, and the anti-cheat
                    logging system.
                  </p>
                </div>

                {/* Role tag */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    MongoDB
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Backend
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    API
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-cyan-500/10 rounded-br-lg pointer-events-none" />
              </div>

              {/* Pranna Nadar */}
              <div className="cyber-card relative overflow-hidden group transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/[0.02]">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/20 via-violet-400 to-violet-500/20 opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xl font-black tracking-wider shadow-lg shadow-violet-500/10">
                    PN
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-violet-400 text-lg sm:text-xl tracking-wide font-black">
                      Pranna Nadar
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-violet-500/70 font-bold mt-0.5">
                      Frontend Developer
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    The creative force behind MindCompile's interface. Pranna
                    crafted the cyberpunk-themed UI, built responsive
                    components, and implemented the sleek animations and
                    interactions that make the platform feel alive and
                    immersive.
                  </p>
                </div>

                {/* Role tag */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    React
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    UI/UX
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    CSS
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-violet-500/10 rounded-br-lg pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scanline */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-40 animate-pulse" />
      </section>
    </>
  );
};

export default About;

