// @ts-nocheck
import React, { useContext, useState } from "react";
import { RoundContext } from "../context/ContextProvider";
import { Link } from "react-router-dom";

const Rounds = () => {
  // Control round access
  const { rounds, setRoundAccess, roundAccess } = useContext(RoundContext);
  return (
    <section className="relative min-h-screen bg-black text-green-400 font-mono overflow-hidden px-4 sm:px-6 lg:px-12 py-16">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,0,0.08),transparent_60%)]" />

      {/* Page Title */}
      <h1 className="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_15px_#00ff00] text-center mb-12">
        MindCompile Rounds
      </h1>

      {/* Rounds Stack */}
      <div className="relative z-10 flex flex-col gap-8 max-w-4xl mx-auto">
        {rounds.map((round) => (
          <div
            key={round.id}
            className={`border border-green-500/30 bg-black/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(0,255,0,0.15)] transition-all hover:shadow-[0_0_50px_rgba(0,255,0,0.25)] ${
              round.access ? "" : "opacity-50"
            }`}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-green-400 drop-shadow-[0_0_10px_#00ff00]">
                {round.name}
              </h2>
              <p className="mt-2 text-green-500/70 text-sm sm:text-base leading-relaxed">
                {round.description}
              </p>
            </div>

            <Link
              to={round.access ? "/code-n-submit" : "#"}
              onClick={(e) => {
                if (!round.access) e.preventDefault();
              }}
              className={`mt-6 px-6 py-3 border border-green-400 text-green-400 font-semibold transition-all duration-300 ${
                round.access
                  ? "hover:bg-green-400 hover:text-black shadow-[0_0_15px_rgba(0,255,0,0.3)] cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              {round.access ? "Enter / Code" : "Locked"}
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom scanline */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>

      {/* Keyframes for scan bar */}
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
