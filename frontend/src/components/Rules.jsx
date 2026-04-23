import React from "react";

const Rules = () => {
  return (
    <section className="relative min-h-screen bg-black text-green-300 font-mono overflow-hidden px-4 sm:px-8 lg:px-16 py-14 sm:py-20">
      {/* Deep ambient system glow (subtle, not noisy) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,0,0.12),transparent_55%)] pointer-events-none" />

      {/* Moving scanline layer */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none animate-[scanFade_8s_linear_infinite]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,0,0.18) 4px)",
        }}
      />

      {/* Grid depth layer */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.2)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-10 sm:space-y-14">
        {/* HEADER */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.2em] text-green-300 leading-tight drop-shadow-[0_0_18px_rgba(0,255,0,0.35)]">
            {"> SYSTEM PROTOCOL"}
          </h1>

          <p className="text-green-500/70 text-sm sm:text-base tracking-wide">
            read rules carefully — system enforces strict execution
          </p>
        </header>

        {/* GRID CONTENT */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* TEAM RULES */}
          <div className="relative border border-green-500/20 bg-black/60 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-[0_0_25px_rgba(0,255,0,0.08)] hover:shadow-[0_0_30px_rgba(0,255,0,0.12)] transition">
            <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4">
              {"> team.config"}
            </h2>

            <ul className="space-y-3 text-sm sm:text-base text-green-400/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-green-300">{">"}</span>
                solo participation only
              </li>
              <li className="flex gap-2">
                <span className="text-green-300">{">"}</span>
                register individually
              </li>
              <li className="flex gap-2 text-red-400">
                <span>⚠</span>
                collaboration = disqualification
              </li>
            </ul>
          </div>

          {/* PROTOCOL RULES */}
          <div className="relative border border-green-500/20 bg-black/60 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-[0_0_25px_rgba(0,255,0,0.08)]">
            <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4">
              {"> execution.protocol"}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-green-400/80">
              <p className="flex gap-2">
                <span className="text-green-300">{">"}</span>
                no external tools allowed
              </p>
              <p className="flex gap-2">
                <span className="text-green-300">{">"}</span>
                focus on logic, not execution
              </p>
              <p className="flex gap-2 text-yellow-400">
                <span>!</span>
                time pressure increases each round
              </p>
            </div>
          </div>
        </div>

        {/* ROUNDS */}
        <div className="space-y-6 sm:space-y-8">
          {[
            {
              title: "Round 1 — Warm Start",
              score: "10",
              lines: [
                "simple logic problems",
                "limited time window",
                "focus: accuracy",
              ],
            },
            {
              title: "Round 2 — Core Challenge",
              score: "20",
              lines: [
                "medium difficulty problem",
                "no execution allowed",
                "focus: reasoning",
              ],
            },
            {
              title: "Round 3 — Final Lock",
              score: "30",
              lines: [
                "hard problem",
                "single attempt only",
                "focus: precision under pressure",
              ],
            },
          ].map((r, i) => (
            <div
              key={i}
              className="group relative border border-green-500/20 bg-black/60 p-5 sm:p-6 rounded-xl transition hover:border-green-400/40 hover:shadow-[0_0_30px_rgba(0,255,0,0.12)]"
            >
              {/* subtle corner glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(0,255,0,0.08),transparent_60%)] transition" />

              <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-green-300 tracking-wide">
                  {"> "}
                  {r.title}
                </h3>

                <span className="text-green-400/70 text-sm">
                  score: <span className="text-green-300">{r.score}</span>
                </span>
              </div>

              <ul className="relative space-y-2 text-sm sm:text-base text-green-400/70">
                {r.lines.map((l, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-green-300">{">"}</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* WARNING */}
        <div className="border-l-2 border-red-500 pl-4 text-red-400 text-sm sm:text-base leading-relaxed">
          ⚠ system violation (debugging / collaboration / external help) results
          in immediate disqualification
        </div>
      </div>

      {/* bottom scan line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/30 blur-sm"
          style={{ animation: "scanMove 6s linear infinite" }}
        />
      </div>

      <style>
        {`
        @keyframes scanMove {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }

        @keyframes scanFade {
          0% { opacity: 0.05; }
          50% { opacity: 0.09; }
          100% { opacity: 0.05; }
        }
      `}
      </style>
    </section>
  );
};

export default Rules;
