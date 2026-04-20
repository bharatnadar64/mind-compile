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
    <div className="relative min-h-screen bg-black text-green-400 font-mono p-6 overflow-hidden">
      {/* ambient glow */}
      <div className="absolute inset-0 bg-red-500/5 blur-2xl opacity-20 pointer-events-none" />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.12) 3px)",
        }}
      />

      {/* HEADER */}
      <div className="relative z-10 mb-8">
        <h1 className="text-4xl font-bold tracking-widest text-red-400 drop-shadow-[0_0_15px_rgba(255,0,0,0.7)]">
          {"> CONTROL ROOM DASHBOARD"}
        </h1>
        <p className="text-red-500/60 mt-2 text-sm">
          live system monitoring active
        </p>
      </div>

      {/* SYSTEM METRICS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "participants.online", value: totalUsers },
          { label: "submissions.stream", value: totalSubmissions },
          { label: "system.score.pool", value: totalScore },
        ].map((item, i) => (
          <div
            key={i}
            className="border border-red-500/30 bg-black/70 p-5 rounded shadow-[0_0_20px_rgba(255,0,0,0.1)]"
          >
            <p className="text-red-400/70 text-sm">
              {"> "}
              {item.label}
            </p>
            <h2 className="text-3xl font-bold text-red-300 mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* GRID SECTION */}
      <div className="relative z-10 grid md:grid-cols-2 gap-6">
        {/* LEADERBOARD */}
        <div className="border border-red-500/30 bg-black/70 p-5 rounded">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl text-red-300">{"> live.rankings"}</h2>
            <button
              onClick={() => navigate("/admin/leaderboard")}
              className="text-red-400 text-sm hover:text-red-300"
            >
              expand →
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {leaderboard.slice(0, 5).map((user, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-red-500/10 pb-1"
              >
                <span>
                  #{i + 1} {user.participantId?.name || "Unknown"}
                </span>
                <span className="text-red-300">{user.totalScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMISSIONS LOG */}
        <div className="border border-red-500/30 bg-black/70 p-5 rounded">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl text-red-300">{"> event.stream"}</h2>
            <button
              onClick={() => navigate("/admin/submissions")}
              className="text-red-400 text-sm hover:text-red-300"
            >
              expand →
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto text-sm">
            {submissions.slice(0, 5).map((s) => (
              <div key={s._id} className="border-b border-red-500/10 pb-2">
                <p>
                  {"> "}
                  {s.name || s.participantId?.name} →{" "}
                  {s.problemTitle || s.problemId?.title}
                </p>
                <p className="text-red-300/70">score: {s.scoreAwarded}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SYSTEM FOOTER STATUS */}
      <div className="relative z-10 mt-10 text-xs text-red-500/60 flex justify-between border-t border-red-500/10 pt-3">
        <span>{"> system.status: ONLINE"}</span>
        <span className="animate-pulse">{"> monitoring.active: TRUE"}</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
