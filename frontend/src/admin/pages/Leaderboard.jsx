// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getLeaderboard } from "../services/adminApi";
import { motion, AnimatePresence } from "framer-motion";

const Leaderboard = () => {
  const { api } = useContext(RoundContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await getLeaderboard(api);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-mono tracking-widest text-xs animate-pulse uppercase">Syncing_Ranking_Matrix...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-slate-300 font-mono p-4 sm:p-10 overflow-hidden">
      {/* ===== BACKGROUND FX ===== */}
      <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, #06b6d4 3px)",
        }}
      />

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-10 relative z-10">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-mono font-black tracking-widest text-cyan-500 glitch break-words" data-text="> ./htop --root">
            {"> ./htop --root"}<span className="blink text-cyan-500">█</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <p className="text-cyan-500/60 text-xs font-mono font-black uppercase tracking-[0.4em]">// SYSTEM_MONITOR_ACTIVE</p>
          </div>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="w-full md:w-auto px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black font-mono text-xs tracking-widest hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all uppercase"
          style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
        >
          ./RESCAN_NETWORK
        </button>
      </div>

      {/* ===== LIST ===== */}
      <div className="relative z-10 space-y-3">
        {data.map((user, i) => {
          const isTop3 = i < 3;
          const rankColor = i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-emerald-500/60";
          const bgColor = i === 0 ? "bg-yellow-500/5 border-yellow-500/20" : i === 1 ? "bg-slate-500/5 border-slate-500/20" : i === 2 ? "bg-amber-600/5 border-amber-600/20" : "bg-white/[0.01] border-white/5";

          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i}
              className={`group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-4 sm:p-6 ${bgColor} border hover:border-cyan-500/30 transition-all duration-300`}
              style={{ clipPath: "polygon(0 0, 99% 0, 100% 30%, 100% 100%, 1% 100%, 0 70%)" }}
            >
              {/* RANK */}
              <div className="w-20 flex flex-col items-center">
                <span className={`text-4xl font-black italic tracking-tighter ${rankColor}`}>
                  #{ (i + 1).toString().padStart(2, '0') }
                </span>
                <span className="text-[10px] font-bold text-slate-700 tracking-widest uppercase">POSITION</span>
              </div>

              {/* IDENTITY */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-widest uppercase group-hover:text-cyan-400 transition-colors truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">NODE_ID: {user._id?.slice(-12).toUpperCase()}</p>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-600 tracking-widest uppercase">COMM_LINK</span>
                  <p className="text-xs font-black text-slate-400 truncate max-w-[200px] uppercase">{user.email}</p>
                </div>
              </div>

              {/* YIELD */}
              <div className="w-full sm:w-32 text-left sm:text-right">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-600 tracking-widest uppercase">TOTAL_YIELD</span>
                  <p className={`text-2xl font-black tabular-nums tracking-tighter ${isTop3 ? 'text-white' : 'text-slate-400'}`}>
                    {user.totalScore}_PTS
                  </p>
                </div>
              </div>

              {/* DECORATIVE BAR */}
              <div className="hidden lg:block w-32 h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (user.totalScore / (data[0].totalScore || 1)) * 100)}%` }}
                  className={`h-full ${isTop3 ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-slate-700'}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ===== SYSTEM LOGS ===== */}
      <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500 tracking-[0.3em] border-t border-white/5 pt-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>ENCRYPTION: AES-256-NODE</span>
          </div>
          <span>TOTAL_NODES: {data.length}</span>
        </div>
        <div className="text-cyan-500/60 uppercase">Live_Ranking_Propagation_Stable</div>
      </div>
    </div>
  );
};

export default Leaderboard;
