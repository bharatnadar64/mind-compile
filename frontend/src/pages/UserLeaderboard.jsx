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
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE_RANKING_FEED
            </div>
            <h1 
              className="text-4xl sm:text-6xl font-bold tracking-tighter text-white glitch"
              data-text={typedText}
            >
              {typedText}
              <span className="text-emerald-500 animate-pulse">_</span>
            </h1>
          </div>

          <button
            onClick={() => fetchLeaderboard(false)}
            className="self-start md:self-auto px-6 py-2 rounded-full glass-panel border-white/5 hover:border-emerald-500/30 transition-all text-sm font-bold tracking-widest flex items-center gap-3 active:scale-95"
          >
            <span className={refreshing ? "animate-spin" : ""}>⟳</span>
            {refreshing ? "SYNCING..." : "SYNC_DATA"}
          </button>
        </div>

        {/* TOP 3 PODIUM - RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {data.slice(0, 3).map((user, i) => {
            const isFirst = i === 0;
            const rankStyles = [
              { border: "border-emerald-500/40", glow: "shadow-[0_0_50px_rgba(16,185,129,0.15)]", icon: "🥇", label: "DOMINATOR", text: "text-emerald-400" },
              { border: "border-cyan-500/40", glow: "shadow-[0_0_50px_rgba(6,182,212,0.1)]", icon: "🥈", label: "ELITE", text: "text-cyan-400" },
              { border: "border-rose-500/40", glow: "shadow-[0_0_50px_rgba(244,63,94,0.1)]", icon: "🥉", label: "MASTER", text: "text-rose-400" }
            ];

            return (
              <motion.div
                key={user.participantId?._id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`relative group ${isFirst ? "md:-translate-y-6" : "md:translate-y-6"}`}
              >
                <div className={`cyber-card h-full flex flex-col items-center text-center p-10 ${rankStyles[i].border} ${rankStyles[i].glow} hover:-translate-y-2 transition-all duration-500`}
                     style={{ clipPath: "polygon(0 15px, 15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px))" }}>
                  <div className="absolute top-4 right-6 text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">{rankStyles[i].label}</div>
                  
                  <div className="w-24 h-24 flex items-center justify-center text-5xl mb-8 bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all duration-500"
                       style={{ clipPath: "polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)" }}>
                    {rankStyles[i].icon}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2 truncate w-full group-hover:text-emerald-400 transition-colors">{user.participantId?.name.toUpperCase()}</h3>
                  <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase mb-8 truncate w-full font-mono">{user.participantId?.college}</p>
                  
                  <div className="mt-auto w-full p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                    <div className={`text-4xl font-black ${rankStyles[i].text} neon-text tabular-nums`}>{user.totalScore}</div>
                    <div className="text-[10px] text-slate-600 font-mono tracking-[0.4em] mt-2 uppercase">NODE_PTS</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* REMAINING LIST */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between px-6 py-2 text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase border-b border-white/5 mb-4">
            <span>NODE_ID</span>
            <div className="flex gap-4 sm:gap-20">
              <span>SCORE</span>
              <span className="hidden md:block">INTEGRITY_CHECK</span>
            </div>
          </div>

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
                  className={`group relative overflow-hidden p-6 transition-all duration-500 border
                    ${isCurrentUser ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03]"}
                  `}
                  style={{ clipPath: "polygon(0 0, 98% 0, 100% 30%, 100% 100%, 2% 100%, 0 70%)" }}
                >
                  {/* Progress Background Overlay */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-emerald-500/[0.03] transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />

                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8 z-10">
                    <div className="flex items-center gap-4 sm:gap-10">
                      <span className="font-mono text-xl font-black text-slate-700 w-8 sm:w-12 tabular-nums">{(actualIndex + 1).toString().padStart(2, '0')}</span>
                      <div className="flex flex-col">
                        <span className={`text-lg font-black tracking-tight ${isCurrentUser ? "text-emerald-400" : "text-white"}`}>
                          {user.participantId?.name.toUpperCase()} {isCurrentUser && <span className="ml-2 text-[10px] text-emerald-500 animate-pulse font-mono">[ROOT_ACCESS]</span>}
                        </span>
                        <span className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-mono mt-1">{user.participantId?.college}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-16 mt-4 sm:mt-0 self-end sm:self-auto">
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors tabular-nums">{user.totalScore}</span>
                        <span className="text-[9px] text-slate-700 font-mono tracking-[0.3em] uppercase">PTS_SYNCED</span>
                      </div>
                      <div className="hidden md:flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(b => (
                          <div key={b} className={`w-1.5 h-3 rounded-sm ${b <= 4 ? "bg-emerald-500/40" : "bg-white/5"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* SYSTEM FOOTER */}
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500 tracking-[0.2em] border-t border-white/5 pt-8">
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
