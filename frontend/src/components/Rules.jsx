import React from "react";

const Rules = () => {
  return (
    <section className="min-h-screen bg-black text-green-400 font-mono px-6 sm:px-10 lg:px-20 py-16 relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_15px_#00ff00]">
          MindCompile Rules
        </h1>

        {/* Team Formation */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_#00ff00]">
            Team Formation Rules
          </h2>
          <ul className="list-disc list-inside text-green-500/70 text-sm sm:text-base space-y-1">
            <li>Solo participation only.</li>
            <li>
              Each participant must register individually; no teams or
              collaborations are allowed.
            </li>
          </ul>
        </div>

        {/* Event Structure */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_#00ff00]">
            Event Structure & Workflow
          </h2>

          {/* Round 1 */}
          <div className="space-y-2 border border-green-500/30 bg-black/60 backdrop-blur-md p-4 sm:p-6 shadow-[0_0_20px_rgba(0,255,0,0.15)]">
            <h3 className="text-xl sm:text-2xl font-semibold text-green-400">
              Round 1: Warm-Up – Simple Problems
            </h3>
            <ul className="list-disc list-inside text-green-500/70 text-sm sm:text-base space-y-1">
              <li>Format: 2 simple problems.</li>
              <li>
                Execution: Each problem allows 1 execution attempt. Once
                submitted, the solution is final and cannot be revoked.
              </li>
              <li>Time Limit: 10 minutes.</li>
              <li>
                Scoring: Both solutions correct → 10 points. Bonus: +5 points
                for first correct submission, +2 points for clean, structured
                code.
              </li>
              <li>
                Objective: Test participants’ fundamental coding skills and
                precision under time pressure.
              </li>
            </ul>
          </div>

          {/* Round 2 */}
          <div className="space-y-2 border border-green-500/30 bg-black/60 backdrop-blur-md p-4 sm:p-6 shadow-[0_0_20px_rgba(0,255,0,0.15)]">
            <h3 className="text-xl sm:text-2xl font-semibold text-green-400">
              Round 2: Core Problem – Medium Difficulty
            </h3>
            <ul className="list-disc list-inside text-green-500/70 text-sm sm:text-base space-y-1">
              <li>Format: 1 medium core problem.</li>
              <li>
                Execution: No execution allowed; participants submit directly.
              </li>
              <li>Time Limit: 15 minutes.</li>
              <li>
                Scoring: Correct solution → 20 points. Bonus: +5 points for
                first correct submission, +2 points for clean, structured code.
              </li>
              <li>
                Objective: Evaluate problem-solving ability and logical thinking
                without relying on execution.
              </li>
            </ul>
          </div>

          {/* Round 3 */}
          <div className="space-y-2 border border-green-500/30 bg-black/60 backdrop-blur-md p-4 sm:p-6 shadow-[0_0_20px_rgba(0,255,0,0.15)]">
            <h3 className="text-xl sm:text-2xl font-semibold text-green-400">
              Round 3: Final Challenge – Hard Problem
            </h3>
            <ul className="list-disc list-inside text-green-500/70 text-sm sm:text-base space-y-1">
              <li>Format: 1 difficult problem.</li>
              <li>
                Execution: Participants are allowed a single execution attempt
                before submission.
              </li>
              <li>Time Limit: 20 minutes.</li>
              <li>
                Scoring: Correct solution → 30 points. Bonus: +5 points for
                first correct submission, +2 points for clean, structured code.
              </li>
              <li>
                Objective: Test high-level coding proficiency, accuracy, and
                strategic thinking under pressure.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom scanline */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-40 animate-pulse" />
    </section>
  );
};

export default Rules;
