// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoundContext } from "../../context/ContextProvider";

const AdminDashboard = () => {
  const { api } = useContext(RoundContext);
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const lb = await api.get("/api/admin/leaderboard");
      const subs = await api.get("/api/admin/submissions");

      setLeaderboard(lb.data || []);
      setSubmissions(subs.data || []);
    } catch (err) {

    }
  };

  const totalUsers = leaderboard.length;
  const totalSubmissions = submissions.length;
  const totalScore = leaderboard.reduce(
    (sum, u) => sum + (u.totalScore || 0),
    0,
  );

  return (
    <div className="relative min-h-screen bg-black text-green-400 font-mono p-4 sm:p-6 overflow-hidden">
      {/* ===== INLINE FX ===== */}
      <style>{`
      @keyframes blink { 50% { opacity: 0; } }

      @keyframes scanMove {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }

      @keyframes barLoad {
        from { width: 0%; }
        to { width: 100%; }
      }

      .blink { animation: blink 1s step-end infinite; }

      .scanline-move {
        animation: scanMove 6s linear infinite;
      }

      .bar-load {
        animation: barLoad 1.2s ease-out;
      }
    `}</style>

      {/* ===== BACKGROUND ===== */}

      {/* subtle red glow (system layer) */}
      <div className="absolute inset-0 bg-red-500/5 blur-2xl opacity-20 pointer-events-none" />

      {/* moving scan beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scanline-move h-20 bg-gradient-to-b from-transparent via-red-500/10 to-transparent" />
      </div>

      {/* static scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.12) 3px)",
        }}
      />

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-widest text-white glitch" data-text="STRATEGIC_OPERATIONS">
            STRATEGIC_OPERATIONS
          </h1>
          <p className="text-rose-500 text-xs mt-1 font-mono uppercase tracking-[0.4em] font-bold">SYSTEM_CORE_LEVEL_01_AUTH</p>
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] tracking-widest uppercase">
            THREAT: LOW
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
            NODES: STABLE
          </div>
        </div>
      </div>

      {/* ===== METRICS ===== */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "PARTICIPANTS_ONLINE", value: totalUsers, color: "text-emerald-400" },
          { label: "SUBMISSION_STREAM", value: totalSubmissions, color: "text-blue-400" },
          { label: "SCORE_POOL_TOTAL", value: totalScore, color: "text-purple-400" },
        ].map((item, i) => (
          <div
            key={i}
            className="group relative p-8 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}
          >
            <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] mb-4 uppercase">
              {"> "} {item.label}
            </p>

            <h2 className={`text-4xl font-black ${item.color} tabular-nums mb-6`}>
              {item.value}
            </h2>

            <div className="h-1 bg-white/5 overflow-hidden">
              <div className={`h-full ${item.color.replace('text-', 'bg-')} bar-load`} style={{ opacity: 0.4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-8 mb-12">
        {/* LEADERBOARD */}
        <div className="relative p-6 sm:p-10 bg-white/[0.02] border border-white/5"
             style={{ clipPath: "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)" }}>
          
          <div className="flex justify-between mb-10 items-center border-b border-white/5 pb-4">
            <h2 className="text-xl font-black text-white tracking-widest uppercase">{">"} LIVE_RANKINGS</h2>
            <button
              onClick={() => navigate("/admin/leaderboard")}
              className="text-[10px] font-black text-emerald-500/60 hover:text-emerald-400 uppercase tracking-widest transition-colors"
            >
              EXPAND_ALL_NODES_
            </button>
          </div>

          <div className="space-y-4">
            {leaderboard.slice(0, 8).map((user, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] p-3 border-l-2 border-emerald-500/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-600 font-bold">#{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="text-sm font-black text-slate-300 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                    {user.participantId?.name || "ANONYMOUS_NODE"}
                  </span>
                </div>
                <span className="text-emerald-400 font-black tabular-nums">{user.totalScore}</span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <div className="text-center py-10 text-slate-600 font-mono text-xs uppercase tracking-widest">
                WAITING_FOR_DATA_PACKETS...
              </div>
            )}
          </div>
        </div>

        {/* SUBMISSION STREAM */}
        <div className="relative p-6 sm:p-10 bg-white/[0.02] border border-white/5"
             style={{ clipPath: "polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)" }}>
          
          <div className="flex justify-between mb-10 items-center border-b border-white/5 pb-4">
            <h2 className="text-xl font-black text-white tracking-widest uppercase">{">"} EVENT_STREAM</h2>
            <button
              onClick={() => navigate("/admin/submissions")}
              className="text-[10px] font-black text-blue-500/60 hover:text-blue-400 uppercase tracking-widest transition-colors"
            >
              MONITOR_TRAFFIC_
            </button>
          </div>

          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
            {submissions.slice(0, 10).map((s) => (
              <div key={s._id} className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-tight">
                    {s.name || s.participantId?.name || "UNKNOWN_SOURCE"}
                  </p>
                  <span className="text-[10px] font-black text-emerald-400 tabular-nums">+{s.scoreAwarded}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="text-blue-500">↳</span>
                  <span className="truncate">{s.problemTitle || s.problemId?.title || "LOGIC_CORE_TASK"}</span>
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="text-center py-10 text-slate-600 font-mono text-xs uppercase tracking-widest">
                NO_TRAFFIC_DETECTED_
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-black tracking-[0.2em] border-t border-white/5 pt-6 uppercase">
        <div className="flex items-center gap-4">
          <span className="text-emerald-500/60">SYSTEM_CORE: ONLINE</span>
          <span className="text-blue-500/60">PACKETS: STABLE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>REALTIME_ENCRYPTION_ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
