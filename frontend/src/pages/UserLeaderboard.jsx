// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { motion, AnimatePresence } from "framer-motion";

const UserLeaderboard = () => {
  const { api } = useContext(RoundContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [typedText, setTypedText] = useState("");

  const fullText = "REALTIME_NODE_RANKINGS";

  useEffect(() => {
    fetchLeaderboard(true);
    let i = 0;
    const typing = setInterval(() => {
      setTypedText(fullText.slice(0, i++));
      if (i > fullText.length) clearInterval(typing);
    }, 50);
    return () => clearInterval(typing);
  }, []);

  const fetchLeaderboard = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      else setRefreshing(true);
      const res = await api.get("/api/leaderboard");
      setData(res.data);
      const participantId = localStorage.getItem("participantId");
      const rank = res.data.findIndex(u => u.participantId?._id === participantId);
      if (rank !== -1) setCurrentUserRank(rank);
    } catch (err) {
      console.error(err);
    } finally {
      if (initial) setLoading(false);
      else setRefreshing(false);
    }
  };

  const maxScore = Math.max(...data.map(u => u.totalScore || 0), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-mono tracking-widest text-xs animate-pulse">CONNECTING_TO_DATABASE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] tracking-[0.4em]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE_RANKING_FEED
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">
              {typedText}
              <span className="text-emerald-500 animate-pulse">_</span>
            </h1>
          </div>

          <button
            onClick={() => fetchLeaderboard(false)}
            className="self-start md:self-auto px-6 py-2 rounded-full glass-panel border-white/5 hover:border-emerald-500/30 transition-all text-xs font-bold tracking-widest flex items-center gap-3 active:scale-95"
          >
            <span className={refreshing ? "animate-spin" : ""}>⟳</span>
            {refreshing ? "SYNCING..." : "SYNC_DATA"}
          </button>
        </div>

        {/* TOP 3 PODIUM - RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {data.slice(0, 3).map((user, i) => {
            const isFirst = i === 0;
            const rankStyles = [
              { border: "border-emerald-500/50", glow: "shadow-[0_0_40px_rgba(16,185,129,0.2)]", icon: "🥇", label: "DOMINATOR" },
              { border: "border-blue-500/50", glow: "shadow-[0_0_40px_rgba(59,130,246,0.15)]", icon: "🥈", label: "ELITE" },
              { border: "border-purple-500/50", glow: "shadow-[0_0_40px_rgba(168,85,247,0.15)]", icon: "🥉", label: "MASTER" }
            ];

            return (
              <motion.div
                key={user.participantId?._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative group ${isFirst ? "md:-translate-y-4" : "md:translate-y-4"}`}
              >
                <div className={`cyber-card h-full flex flex-col items-center text-center p-8 ${rankStyles[i].border} ${rankStyles[i].glow} hover:scale-[1.02]`}>
                  <div className="absolute top-4 right-4 text-[8px] font-bold tracking-[0.2em] text-white/40">{rankStyles[i].label}</div>
                  
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                    {rankStyles[i].icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 truncate w-full">{user.participantId?.name}</h3>
                  <p className="text-[10px] text-slate-500 tracking-widest uppercase mb-6 truncate w-full">{user.participantId?.college}</p>
                  
                  <div className="mt-auto flex flex-col items-center">
                    <div className="text-4xl font-bold text-white neon-text">{user.totalScore}</div>
                    <div className="text-[10px] text-emerald-500 font-mono tracking-widest mt-1">TOTAL_PTS</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* REMAINING LIST */}
        <div className="space-y-4 relative z-10">
          <AnimatePresence mode="popLayout">
            {data.slice(3).map((user, i) => {
              const actualIndex = i + 3;
              const isCurrentUser = actualIndex === currentUserRank;
              const progress = (user.totalScore / maxScore) * 100;

              return (
                <motion.div
                  layout
                  key={user.participantId?._id || actualIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative overflow-hidden glass-panel p-5 transition-all duration-300 hover:border-white/20
                    ${isCurrentUser ? "border-emerald-500/50 bg-emerald-500/5" : "hover:bg-white/5"}
                  `}
                >
                  {/* Progress Background */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-emerald-500/5 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-sm text-slate-500 w-8">#{actualIndex + 1}</span>
                      <div className="flex flex-col">
                        <span className={`font-bold tracking-tight ${isCurrentUser ? "text-emerald-400" : "text-white"}`}>
                          {user.participantId?.name} {isCurrentUser && "(YOU)"}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{user.participantId?.college}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{user.totalScore}</span>
                      <span className="text-[8px] text-slate-600 font-mono tracking-widest">SCORE_VAL</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* SYSTEM FOOTER */}
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-500 tracking-[0.2em] border-t border-white/5 pt-8">
          <div className="flex items-center gap-6">
            <span>ACTIVE_NODES: {data.length}</span>
            <span>ENCRYPTION: AES_256</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYNCHRONIZED_WITH_MAIN_FRAME
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserLeaderboard;
