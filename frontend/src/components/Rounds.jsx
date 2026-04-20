// @ts-nocheck
import React, { useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const Rounds = () => {
  const { rounds, fetchProblem, loadingRounds } = useContext(RoundContext);
  const navigate = useNavigate();

  if (loadingRounds) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center font-mono">
        <div className="animate-pulse text-lg tracking-widest">
          INITIALIZING ROUNDS SYSTEM...
        </div>
      </div>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="min-h-screen bg-black text-red-400 flex items-center justify-center font-mono">
        NO ROUNDS AVAILABLE
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-black text-green-400 font-mono px-6 sm:px-10 py-12 overflow-hidden">
      {/* glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,0,0.08),transparent_60%)]" />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-widest drop-shadow-[0_0_15px_#00ff00]">
          SELECT ROUND
        </h1>
        <p className="text-green-500/60 mt-2 text-sm">
          execute carefully. no retries allowed.
        </p>
      </div>

      {/* cards */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {rounds.map((round) => (
          <div
            key={round._id}
            className={`
              relative p-6 border rounded-xl transition-all duration-300
              overflow-hidden group
              ${
                round.unlocked
                  ? "border-green-400/60 hover:shadow-[0_0_25px_rgba(0,255,0,0.25)]"
                  : "border-red-500/30 opacity-40"
              }
            `}
          >
            {/* animated glow strip */}
            {round.unlocked && (
              <div className="absolute inset-0 opacity-10 bg-green-400 blur-xl group-hover:opacity-20 transition" />
            )}

            {/* scan inside card */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />

            {/* content */}
            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
                  {round.name}
                </h2>

                <span
                  className={`text-xs px-2 py-1 border rounded ${
                    round.unlocked
                      ? "border-green-400 text-green-300"
                      : "border-red-400 text-red-400"
                  }`}
                >
                  {round.unlocked ? "UNLOCKED" : "LOCKED"}
                </span>
              </div>

              <p className="text-green-500/70 mt-2">
                TIME LIMIT: {round.timeLimit} MIN
              </p>

              {/* button */}
              <button
                disabled={!round.unlocked}
                onClick={async () => {
                  await fetchProblem(round.roundNumber);
                  navigate("/code-n-submit");
                }}
                className={`
                  mt-5 px-5 py-2 border transition-all duration-300
                  ${
                    round.unlocked
                      ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-black shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                      : "border-red-500 text-red-500 cursor-not-allowed"
                  }
                `}
              >
                {round.unlocked ? "ENTER TERMINAL" : "ACCESS DENIED"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* bottom scan line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px]">
        <div className="h-full w-1/3 bg-green-400/40 blur-sm animate-[scanMove_4s_linear_infinite]" />
      </div>

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

export default Rounds;
