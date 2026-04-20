// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../context/ContextProvider";

const UserLeaderboard = () => {
  const { api } = useContext(RoundContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/leaderboard");
      setData(res.data);

      // Find current user rank
      const participantId = localStorage.getItem("participantId");
      const rank = res.data.findIndex(
        (user) => user.participantId?._id === participantId,
      );
      if (rank !== -1) {
        setCurrentUserRank(rank);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-6 font-mono flex items-center justify-center">
        <p>$ loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-green-400 font-mono p-6 overflow-hidden pt-24">
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
      <div className="relative z-10 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-green-300 drop-shadow-[0_0_10px_#00ff00]">
          {"> GLOBAL LEADERBOARD"}
        </h1>
        <p className="text-green-500/60 text-sm mt-2">
          $ top performers by total score
        </p>
      </div>

      {/* YOUR RANK */}
      {currentUserRank !== null && (
        <div className="relative z-10 mb-6 border border-blue-500/50 bg-blue-500/5 p-4 rounded">
          <p className="text-blue-300">
            $ your rank:{" "}
            <span className="font-bold">#{currentUserRank + 1}</span> | score:{" "}
            <span className="font-bold">
              {data[currentUserRank]?.totalScore || 0}
            </span>
          </p>
        </div>
      )}

      {/* TABLE HEADER */}
      <div className="relative z-10 grid grid-cols-4 sm:grid-cols-4 text-green-500/70 border-b border-green-500/20 pb-2 mb-3 text-sm sm:text-base">
        <span>RANK</span>
        <span>PLAYER</span>
        <span>COLLEGE</span>
        <span className="text-right">SCORE</span>
      </div>

      {/* LIST */}
      <div className="relative z-10 space-y-2">
        {data.map((user, i) => {
          const isTop3 = i < 3;
          const isCurrentUser = i === currentUserRank;

          return (
            <div
              key={i}
              className={`
                grid grid-cols-4 sm:grid-cols-4 items-center p-3 border rounded
                transition-all duration-200
                ${
                  isCurrentUser
                    ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : isTop3
                      ? "border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                      : "border-green-500/20 bg-black/60"
                }
              `}
            >
              {/* rank */}
              <span
                className={`
                  font-bold
                  ${
                    isCurrentUser
                      ? "text-blue-400"
                      : isTop3
                        ? "text-yellow-400"
                        : "text-green-400"
                  }
                `}
              >
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>

              {/* name */}
              <div className="flex flex-col">
                <span
                  className={`truncate ${isCurrentUser ? "text-blue-300 font-bold" : "text-green-300"}`}
                >
                  {user.participantId?.name || "Unknown"}{" "}
                  {isCurrentUser && "(YOU)"}
                </span>
                <span className="text-green-500/40 text-xs truncate">
                  {user.participantId?.email || ""}
                </span>
              </div>

              {/* college */}
              <span className="text-green-500/60 text-xs sm:text-sm truncate">
                {user.participantId?.college || "-"}
              </span>

              {/* score */}
              <span
                className={`
                  text-right font-bold
                  ${isCurrentUser ? "text-blue-400" : isTop3 ? "text-yellow-400" : "text-green-400"}
                `}
              >
                {user.totalScore}
              </span>
            </div>
          );
        })}
      </div>

      {/* FOOTER STATUS */}
      <div className="relative z-10 mt-8 text-xs text-green-500/60 flex justify-between border-t border-green-500/10 pt-3">
        <span>{`> total.players: ${data.length}`}</span>
        <span className="animate-pulse">{"> live.sync..."}</span>
      </div>
    </div>
  );
};

export default UserLeaderboard;
