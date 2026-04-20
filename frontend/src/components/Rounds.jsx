// @ts-nocheck
import React, { useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const Rounds = () => {
  const { rounds, fetchProblem } = useContext(RoundContext);
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-black text-green-400 font-mono p-6 sm:p-10 overflow-hidden">
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

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-widest drop-shadow-[0_0_12px_#00ff00]">
          {"> SELECT ROUND"}
        </h1>
        <p className="text-green-500/70 mt-3 text-sm sm:text-base">
          choose your challenge. no second attempts.
        </p>
      </div>

      {/* Rounds */}
      <div className="relative z-10 flex flex-col gap-6 max-w-3xl mx-auto">
        {rounds.map((round) => (
          <div
            key={round._id}
            className={`
              relative border rounded-lg p-6 transition-all duration-300
              ${
                round.unlocked
                  ? "border-green-400/60 shadow-[0_0_20px_rgba(0,255,0,0.2)] hover:shadow-[0_0_35px_rgba(0,255,0,0.35)]"
                  : "border-green-500/20 opacity-40"
              }
            `}
          >
            {/* subtle scan inside card */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:100%_3px]" />

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl mb-2">
              {"> "} {round.name}
            </h2>

            {/* Info */}
            <p className="text-green-500/70 text-sm sm:text-base">
              {"> time.limit: "} {round.timeLimit} mins
            </p>

            {/* Status */}
            <p
              className={`text-sm mt-1 ${
                round.unlocked ? "text-green-400" : "text-red-400"
              }`}
            >
              {round.unlocked
                ? "> status: unlocked"
                : "> status: access denied"}
            </p>

            {/* Button */}
            <button
              disabled={!round.unlocked}
              onClick={() => {
                fetchProblem(round.roundNumber);
                navigate("/code-n-submit");
              }}
              className={`
                mt-5 px-5 py-2 border transition-all duration-300
                ${
                  round.unlocked
                    ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-black shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                    : "border-red-500 text-red-400 cursor-not-allowed"
                }
              `}
            >
              {round.unlocked ? "ENTER TERMINAL" : "LOCKED"}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>

      {/* Animation */}
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
