// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { motion } from "framer-motion";

const UserLeaderboard = () => {
  const { api } = useContext(RoundContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [text, setText] = useState("");

  const fullText = "> initializing_leaderboard_system...";

  useEffect(() => {
    fetchLeaderboard(true);

    // typing effect
    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.slice(0, i++));
      if (i > fullText.length) clearInterval(typing);
    }, 25);

    return () => clearInterval(typing);
  }, []);

  const fetchLeaderboard = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      else setRefreshing(true);

      const res = await api.get("/api/leaderboard");

      // smooth update instead of full reset
      setData((prev) => {
        if (!prev.length) return res.data;

        return res.data.map((newUser, i) => {
          const oldUser = prev[i];
          if (!oldUser) return newUser;

          if (
            oldUser.totalScore === newUser.totalScore &&
            oldUser.participantId?._id === newUser.participantId?._id
          ) {
            return oldUser;
          }
          return newUser;
        });
      });

      const participantId = localStorage.getItem("participantId");
      const rank = res.data.findIndex(
        (user) => user.participantId?._id === participantId,
      );
      if (rank !== -1) setCurrentUserRank(rank);
    } catch (err) {
      console.log(err);
    } finally {
      if (initial) setLoading(false);
      else setRefreshing(false);
    }
  };

  const maxScore = Math.max(...data.map((u) => u.totalScore || 0), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <p className="text-green-400 animate-pulse text-lg">
          $ booting_system...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono px-6 pt-16 relative overflow-hidden">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,255,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* RADIAL GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,255,0,0.25),transparent_60%)]" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest text-green-300 drop-shadow-[0_0_20px_#00ff00]">
            {text}
          </h1>
          <p className="text-green-500/60 mt-2">$ real_time_competition_feed</p>
        </div>

        {/* REFRESH BUTTON */}
        <button
          onClick={() => fetchLeaderboard(false)}
          className="border border-green-400/40 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-all shadow-[0_0_10px_#00ff00] flex items-center gap-2"
        >
          {refreshing ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <span>⟳</span>
          )}
          <span className="text-sm">REFRESH</span>
        </button>
      </div>

      {/* CURRENT USER */}
      {currentUserRank !== null && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 p-5 border border-blue-500/50 rounded-xl bg-blue-500/10 backdrop-blur-md shadow-[0_0_25px_rgba(59,130,246,0.6)]"
        >
          <p className="text-blue-300 text-lg">
            $ YOU → RANK #{currentUserRank + 1} | SCORE{" "}
            {data[currentUserRank]?.totalScore || 0}
          </p>
        </motion.div>
      )}

      {/* PODIUM */}
      <div className="grid grid-cols-3 gap-6 mb-14">
        {data.slice(0, 3).map((user, i) => {
          const isFirst = i === 0;
          return (
            <motion.div
              layout
              key={user.participantId?._id || i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`relative p-6 rounded-2xl border text-center transform
              ${isFirst ? "scale-110 border-yellow-400 shadow-[0_0_40px_rgba(255,215,0,0.8)]" : "scale-95 border-green-500/30"}`}
            >
              {isFirst && (
                <div className="absolute -top-3 right-3 text-xs text-yellow-300 animate-pulse">
                  SYSTEM_DOMINATOR
                </div>
              )}

              <div className="text-3xl mb-2">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
              </div>
              <div className="text-lg font-bold text-green-300">
                {user.participantId?.name}
              </div>
              <div className="text-green-500/60 text-sm">
                {user.participantId?.college}
              </div>
              <div className="mt-3 text-xl font-bold text-yellow-300">
                {user.totalScore}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {data.slice(3).map((user, i) => {
          const actualIndex = i + 3;
          const isCurrentUser = actualIndex === currentUserRank;

          return (
            <motion.div
              layout
              key={user.participantId?._id || actualIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y / rect.height - 0.5) * -10;
                const rotateY = (x / rect.width - 0.5) * 10;
                e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `perspective(800px) rotateX(0) rotateY(0) scale(1)`;
              }}
              className={`p-5 border rounded-xl backdrop-blur-md transition-all duration-300
              ${isCurrentUser ? "border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.6)]" : "border-green-500/20 bg-black/60"}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-400 font-bold mr-4">
                    #{actualIndex + 1}
                  </span>
                  <span
                    className={`font-semibold ${isCurrentUser ? "text-blue-300" : "text-green-300"}`}
                  >
                    {user.participantId?.name} {isCurrentUser && "(YOU)"}
                  </span>
                </div>
                <span className="font-bold text-green-300">
                  {user.totalScore}
                </span>
              </div>

              {/* SCORE BAR */}
              <div className="w-full bg-green-900/30 h-1 mt-3 rounded">
                <div
                  className="bg-green-400 h-1 rounded shadow-[0_0_12px_#00ff00]"
                  style={{ width: `${(user.totalScore / maxScore) * 100}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-12 flex justify-between text-green-500/60 text-sm border-t border-green-500/20 pt-4">
        <span>{`> total_nodes: ${data.length}`}</span>
        <span className="text-green-400">● MANUAL_REFRESH</span>
      </div>
    </div>
  );
};

export default UserLeaderboard;
