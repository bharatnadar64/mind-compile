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
      console.log("Dashboard fetch error:", err);
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
      <div className="relative z-10 mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-red-400 flex items-center gap-2">
          <span>{">"}</span>
          <span>CONTROL_ROOM</span>
          <span className="text-green-400">::DASHBOARD</span>
          <span className="blink">_</span>
        </h1>

        <div className="mt-2 text-xs sm:text-sm text-green-500/70 flex flex-wrap gap-4">
          <span>{"> uptime: 72h"}</span>
          <span>{"> nodes: active"}</span>
          <span className="text-red-500/70">{"> threat.level: low"}</span>
        </div>
      </div>

      {/* ===== METRICS ===== */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: "participants.online", value: totalUsers },
          { label: "submissions.stream", value: totalSubmissions },
          { label: "system.score.pool", value: totalScore },
        ].map((item, i) => (
          <div
            key={i}
            className="border border-green-500/20 bg-black/60 p-4 rounded backdrop-blur-sm"
          >
            <p className="text-green-400/60 text-xs">
              {"> "}
              {item.label}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-green-300">
              {item.value}
            </h2>

            {/* progress style bar (unique feel vs pulse) */}
            <div className="mt-3 h-[3px] bg-green-500/10 overflow-hidden">
              <div className="h-full bg-green-400 bar-load" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="relative z-10 grid md:grid-cols-2 gap-6">
        {/* LEADERBOARD */}
        <div className="border border-green-500/20 bg-black/60 p-5 rounded">
          <div className="flex justify-between mb-4 items-center">
            <h2 className="text-lg text-green-300">{"> live.rankings"}</h2>

            <button
              onClick={() => navigate("/admin/leaderboard")}
              className="text-xs text-green-400 hover:text-green-200"
            >
              view_all →
            </button>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            {leaderboard.slice(0, 5).map((user, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-green-500/10 pb-1"
              >
                <span className="flex gap-2">
                  <span className="text-green-500/50">[{i + 1}]</span>
                  {user.participantId?.name || "Unknown"}
                </span>

                <span className="text-green-300">{user.totalScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMISSION STREAM */}
        <div className="border border-green-500/20 bg-black/60 p-5 rounded">
          <div className="flex justify-between mb-4 items-center">
            <h2 className="text-lg text-green-300">{"> event.stream"}</h2>

            <button
              onClick={() => navigate("/admin/submissions")}
              className="text-xs text-green-400 hover:text-green-200"
            >
              view_all →
            </button>
          </div>

          <div className="space-y-2 text-xs sm:text-sm max-h-[300px] overflow-y-auto pr-1">
            {submissions.slice(0, 5).map((s) => (
              <div key={s._id} className="border-b border-green-500/10 pb-2">
                <p>
                  <span className="text-green-500/50">{">"}</span>{" "}
                  {s.name || s.participantId?.name}
                </p>

                <p className="text-green-300/80">
                  ↳ {s.problemTitle || s.problemId?.title}
                </p>

                <p className="text-green-500/60 text-[11px]">
                  score: {s.scoreAwarded}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="relative z-10 mt-10 text-[10px] sm:text-xs text-green-500/60 flex justify-between border-t border-green-500/10 pt-3">
        <span>{"> system.status: ONLINE"}</span>
        <span className="text-green-400">{"> packets: stable"}</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
