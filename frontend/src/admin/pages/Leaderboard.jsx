// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getLeaderboard } from "../services/adminApi";

const Leaderboard = () => {
  const { api } = useContext(RoundContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard(api);
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-green-300 font-mono p-4 sm:p-6 overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-green-500/10 blur-3xl opacity-20 pointer-events-none animate-pulse" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.10) 3px)",
        }}
      />

      {/* ===== HEADER ===== */}
      <div className="relative z-10 mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-green-200 drop-shadow-[0_0_12px_rgba(0,255,0,0.5)]">
          Live Ranking Feed
        </h1>

        <p className="text-green-500/60 text-xs sm:text-sm mt-1">
          Real-time performance tracking across all participants
        </p>
      </div>

      {/* ===== DESKTOP TABLE HEADER ===== */}
      <div className="relative z-10 hidden sm:grid grid-cols-3 text-green-500/60 border-b border-green-500/20 pb-2 mb-3 text-xs">
        <span>Rank</span>
        <span>User</span>
        <span className="text-right">Score</span>
      </div>

      {/* ===== LIST ===== */}
      <div className="relative z-10 space-y-2">
        {data.map((user, i) => {
          const isTop3 = i < 3;

          return (
            <div
              key={i}
              className={`
              group
              grid sm:grid-cols-3 grid-cols-1 gap-2 sm:gap-0
              items-center
              p-3 sm:p-4
              rounded
              border
              transition-all duration-300
              hover:scale-[1.01]
              hover:border-green-400/40
              ${
                isTop3
                  ? "border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.15)]"
                  : "border-green-500/20 bg-black/60"
              }
            `}
            >
              {/* ===== RANK ===== */}
              <div className="flex items-center gap-2">
                <span
                  className={`
                  text-sm font-bold
                  ${isTop3 ? "text-yellow-400" : "text-green-400"}
                `}
                >
                  #{i + 1}
                </span>

                {/* mobile label */}
                <span className="sm:hidden text-green-500/50 text-xs">
                  rank
                </span>
              </div>

              {/* ===== USER INFO ===== */}
              <div className="flex flex-col">
                <span className="text-green-200 truncate group-hover:text-green-100 transition">
                  {user.name}
                </span>

                <span className="text-green-500/50 text-xs truncate">
                  {user.email || "no.email@system.local"}
                </span>
              </div>

              {/* ===== SCORE ===== */}
              <div className="flex sm:justify-end items-center gap-2">
                <span className="sm:hidden text-green-500/50 text-xs">
                  score
                </span>

                <span
                  className={`
                  font-bold text-right
                  ${isTop3 ? "text-yellow-300" : "text-green-300"}
                `}
                >
                  {user.totalScore}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="relative z-10 mt-8 text-xs text-green-500/60 flex justify-between border-t border-green-500/10 pt-3">
        <span>feed.status: ACTIVE</span>
        <span className="animate-pulse text-green-400/70">
          syncing live data...
        </span>
      </div>
    </div>
  );
};

export default Leaderboard;
