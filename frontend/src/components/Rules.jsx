import React from "react";

const Rules = () => {
  return (
    <section className="relative min-h-screen bg-black text-green-400 font-mono px-6 sm:px-10 lg:px-20 py-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-widest drop-shadow-[0_0_15px_#00ff00]">
            {"> SYSTEM PROTOCOL"}
          </h1>
          <p className="text-green-500/70 mt-3 text-sm sm:text-base">
            read carefully. violations will not be tolerated.
          </p>
        </div>

        {/* Team Formation */}
        <div className="space-y-4 border border-green-500/20 bg-black/70 backdrop-blur-md p-5 sm:p-6 rounded">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-300">
            {"> team.config"}
          </h2>

          <ul className="text-green-400 text-sm sm:text-base space-y-2 leading-relaxed">
            <li>{"> solo participation only"}</li>
            <li>{"> each participant must register individually"}</li>
            <li>{"> collaboration = disqualification"}</li>
          </ul>
        </div>

        {/* Event Structure */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-300">
            {"> execution.protocol"}
          </h2>

          {/* Round Card */}
          {[
            {
              title: "Round 1: Warm-Up – Simple Problems",
              points: "10",
              content: [
                "format: 2 simple problems",
                "execution: 1 attempt per problem",
                "time limit: 10 minutes",
                "bonus: +5 first blood, +2 clean code",
                "objective: precision under pressure",
              ],
            },
            {
              title: "Round 2: Core Problem – Medium",
              points: "20",
              content: [
                "format: 1 medium problem",
                "execution: no execution allowed",
                "time limit: 15 minutes",
                "bonus: +5 first blood, +2 clean code",
                "objective: pure logical thinking",
              ],
            },
            {
              title: "Round 3: Final Challenge – Hard",
              points: "30",
              content: [
                "format: 1 difficult problem",
                "execution: single attempt allowed",
                "time limit: 20 minutes",
                "bonus: +5 first blood, +2 clean code",
                "objective: maximum accuracy & strategy",
              ],
            },
          ].map((round, idx) => (
            <div
              key={idx}
              className="border border-green-500/30 bg-black/70 backdrop-blur-md p-5 sm:p-6 rounded shadow-[0_0_20px_rgba(0,255,0,0.15)]"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-green-400">
                  {"> "}
                  {round.title}
                </h3>
                <span className="text-green-300 text-sm">
                  {"> score: "}
                  {round.points}
                </span>
              </div>

              <ul className="text-green-400/80 text-sm sm:text-base space-y-1 leading-relaxed">
                {round.content.map((item, i) => (
                  <li key={i}>
                    {"> "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Warning Footer */}
        <div className="border-t border-green-500/20 pt-6 text-red-400 text-sm sm:text-base">
          ⚠ unauthorized tools, debugging, or collaboration will result in
          immediate disqualification
        </div>
      </div>

      {/* Bottom scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 6s linear infinite" }}
        />
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes scanMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}
      </style>
    </section>
  );
};

export default Rules;
