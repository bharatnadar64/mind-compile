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
    <div className="relative min-h-screen bg-black text-green-400 font-mono px-4 sm:px-6 lg:px-12 pt-20 overflow-hidden">
      {/* ambient glow */}
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
        <h1 className="text-3xl sm:text-5xl font-bold tracking-widest text-green-300 drop-shadow-[0_0_12px_#00ff00]">
          {"> GLOBAL LEADERBOARD"}
        </h1>

        <p className="text-green-500/60 text-sm mt-2">
          $ ranked by performance score
        </p>
      </div>

      {/* YOUR RANK CARD */}
      {currentUserRank !== null && (
        <div className="relative z-10 mb-6 border border-blue-500/40 bg-blue-500/5 p-4 rounded-lg backdrop-blur-md">
          <p className="text-blue-300 text-sm sm:text-base">
            $ your rank:{" "}
            <span className="font-bold text-blue-200">
              #{currentUserRank + 1}
            </span>{" "}
            | score:{" "}
            <span className="font-bold text-blue-200">
              {data[currentUserRank]?.totalScore || 0}
            </span>
          </p>
        </div>
      )}

      {/* TABLE HEADER (hidden on mobile → replaced with cards) */}
      <div className="relative z-10 hidden sm:grid grid-cols-4 text-green-500/60 border-b border-green-500/20 pb-2 mb-3 text-sm">
        <span>RANK</span>
        <span>PLAYER</span>
        <span>COLLEGE</span>
        <span className="text-right">SCORE</span>
      </div>

      {/* LIST */}
      <div className="relative z-10 space-y-3">
        {data.map((user, i) => {
          const isTop3 = i < 3;
          const isCurrentUser = i === currentUserRank;

          return (
            <div
              key={i}
              className={`
              relative rounded-lg border p-4 sm:p-3
              transition-all duration-200
              hover:scale-[1.01]

              ${
                isCurrentUser
                  ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  : isTop3
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-green-500/20 bg-black/60"
              }
            `}
            >
              {/* MOBILE VIEW (stacked card layout) */}
              <div className="sm:hidden space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`font-bold ${isTop3 ? "text-yellow-400" : "text-green-400"}`}
                  >
                    {i === 0
                      ? "🥇"
                      : i === 1
                        ? "🥈"
                        : i === 2
                          ? "🥉"
                          : `#${i + 1}`}
                  </span>

                  <span
                    className={`font-bold ${isCurrentUser ? "text-blue-300" : "text-green-300"}`}
                  >
                    {user.totalScore}
                  </span>
                </div>

                <div className="text-green-300 font-medium truncate">
                  {user.participantId?.name || "Unknown"}{" "}
                  {isCurrentUser && "(you)"}
                </div>

                <div className="text-green-500/50 text-xs truncate">
                  {user.participantId?.college || "-"}
                </div>
              </div>

              {/* DESKTOP VIEW */}
              <div className="hidden sm:grid grid-cols-4 items-center">
                {/* rank */}
                <span
                  className={`font-bold ${
                    isCurrentUser
                      ? "text-blue-400"
                      : isTop3
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  {i === 0
                    ? "🥇"
                    : i === 1
                      ? "🥈"
                      : i === 2
                        ? "🥉"
                        : `#${i + 1}`}
                </span>

                {/* name */}
                <div className="flex flex-col">
                  <span
                    className={`truncate ${
                      isCurrentUser
                        ? "text-blue-300 font-bold"
                        : "text-green-300"
                    }`}
                  >
                    {user.participantId?.name || "Unknown"}{" "}
                    {isCurrentUser && "(YOU)"}
                  </span>

                  <span className="text-green-500/40 text-xs truncate">
                    {user.participantId?.email || ""}
                  </span>
                </div>

                {/* college */}
                <span className="text-green-500/60 text-sm truncate">
                  {user.participantId?.college || "-"}
                </span>

                {/* score */}
                <span
                  className={`text-right font-bold ${
                    isCurrentUser
                      ? "text-blue-400"
                      : isTop3
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  {user.totalScore}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-10 text-xs text-green-500/60 flex justify-between border-t border-green-500/10 pt-3">
        <span>{`> total.players: ${data.length}`}</span>
        <span className="animate-pulse">{"> syncing.live..."}</span>
      </div>
    </div>
  );
};

export default UserLeaderboard;
