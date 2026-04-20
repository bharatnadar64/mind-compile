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
    <div className="relative min-h-screen bg-black text-green-400 font-mono p-6 overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 pointer-events-none" />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.12) 3px)",
        }}
      />

      {/* HEADER */}
      <div className="relative z-10 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-green-300 drop-shadow-[0_0_10px_#00ff00]">
          {"> LIVE RANKING FEED"}
        </h1>
        <p className="text-green-500/60 text-sm mt-1">
          system is tracking performance in real time
        </p>
      </div>

      {/* TABLE HEADER */}
      <div className="relative z-10 grid grid-cols-3 text-green-500/70 border-b border-green-500/20 pb-2 mb-3 text-sm">
        <span>rank</span>
        <span>user</span>
        <span className="text-right">score</span>
      </div>

      {/* LIST */}
      <div className="relative z-10 space-y-2">
        {data.map((user, i) => {
          const isTop3 = i < 3;

          return (
            <div
              key={i}
              className={`
                grid grid-cols-3 items-center p-3 border rounded
                transition-all duration-200
                ${
                  isTop3
                    ? "border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                    : "border-green-500/20 bg-black/60"
                }
              `}
            >
              {/* rank */}
              <span className={isTop3 ? "text-yellow-400" : "text-green-400"}>
                #{i + 1}
              </span>

              {/* name + email */}
              <div className="flex flex-col">
                <span className="text-green-300 truncate">{user.name}</span>

                <span className="text-green-500/50 text-xs truncate">
                  {user.email || "no.email@system"}
                </span>
              </div>

              {/* score */}
              <span className="text-right text-green-400 font-bold">
                {user.totalScore}
              </span>
            </div>
          );
        })}
      </div>

      {/* FOOTER STATUS */}
      <div className="relative z-10 mt-8 text-xs text-green-500/60 flex justify-between border-t border-green-500/10 pt-3">
        <span>{"> feed.status: ACTIVE"}</span>
        <span className="animate-pulse">{"> syncing.data..."}</span>
      </div>
    </div>
  );
};

export default Leaderboard;
