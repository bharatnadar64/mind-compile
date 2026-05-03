// @ts-nocheck
import React, { useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const Rounds = () => {
  const { rounds, fetchProblem, loadingRounds } = useContext(RoundContext);
  const navigate = useNavigate();

  if (loadingRounds) {
    return (
      <div className="min-h-screen bg-slate-950 text-green-400 flex items-center justify-center font-mono">
        <div className="space-y-4 text-center">
          <div className="animate-pulse text-lg tracking-widest">
            ⧉ INITIALIZING SYSTEM...
          </div>
          <div className="text-xs text-green-600 animate-cyber-pulse">
            Loading rounds...
          </div>
        </div>
      </div>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center font-mono">
        <div className="text-center">
          <p className="text-2xl font-bold tracking-widest mb-2">⚠ NO ROUNDS</p>
          <p className="text-sm text-red-500/70">System unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-slate-950 text-green-400 font-mono px-6 sm:px-10 py-12 overflow-hidden scene-3d">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/8 via-transparent to-cyan-900/5 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-3 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,0,0.08),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-widest glow-text mb-2">
          <span className="text-cyan-400">&gt;</span> SELECT ROUND
        </h1>
        <p className="text-green-500/70 text-sm tracking-wide">
          Execute carefully. No retries allowed.
        </p>
      </div>

      {/* Rounds Grid */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-5">
        {rounds.map((round, idx) => (
          <div
            key={round._id}
            className={`
              relative p-6 rounded-lg transition-all duration-300
              overflow-hidden group
              depth-panel card-3d
              ${
                round.unlocked
                  ? "terminal-border-bright hover:shadow-[0_0_30px_rgba(0,255,0,0.3)]"
                  : "terminal-border border-red-500/40 opacity-50"
              }
            `}
            style={{
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            {/* Animated glow strip */}
            {round.unlocked && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-green-400 blur-xl transition-opacity duration-300" />
            )}

            {/* Scanlines */}
            <div className="absolute inset-0 scanlines-fine opacity-5 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-green-300">
                    <span className="text-cyan-400">
                      Round {round.roundNumber}
                    </span>{" "}
                    • {round.name}
                  </h2>
                  <p className="text-green-600 text-sm mt-1">
                    ⏱ {round.timeLimit} minutes
                  </p>
                </div>

                <span
                  className={`
                    text-xs px-3 py-1 border rounded-md font-bold tracking-widest whitespace-nowrap
                    transition-all duration-300
                    ${
                      round.unlocked
                        ? "border-green-400/60 text-green-300 bg-green-500/10"
                        : "border-red-500/50 text-red-400 bg-red-500/10"
                    }
                  `}
                >
                  {round.unlocked ? "🔓 UNLOCKED" : "🔒 LOCKED"}
                </span>
              </div>

              {/* Problem Count */}
              <p className="text-xs text-green-600">
                <span className="text-cyan-400">→</span> Problems in round:{" "}
                {round.totalProblems || "?"}
              </p>

              {/* Button */}
              <button
                disabled={!round.unlocked}
                onClick={async () => {
                  await fetchProblem(round.roundNumber);
                  navigate("/code-n-submit");
                }}
                className={`
                  mt-4 w-full px-5 py-3 border transition-all duration-300 font-bold tracking-widest rounded-md
                  ${
                    round.unlocked
                      ? "btn-primary w-full"
                      : "border-red-500/40 text-red-500/50 cursor-not-allowed"
                  }
                `}
              >
                {round.unlocked ? "→ ENTER TERMINAL ←" : "✗ ACCESS DENIED"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-green-400/50 to-transparent blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>
    </section>
  );
};

export default Rounds;
