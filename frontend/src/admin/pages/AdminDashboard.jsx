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

  // 📊 STATS
  const totalUsers = leaderboard.length;
  const totalSubmissions = submissions.length;
  const totalScore = leaderboard.reduce(
    (sum, u) => sum + (u.totalScore || 0),
    0,
  );

  return (
    <div className="p-6 bg-black text-green-400 min-h-screen font-mono">
      <h1 className="text-3xl mb-6">Admin Dashboard</h1>

      {/* 🔥 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded bg-black/70">
          <p className="text-sm text-green-300">Participants</p>
          <h2 className="text-2xl">{totalUsers}</h2>
        </div>

        <div className="border p-4 rounded bg-black/70">
          <p className="text-sm text-green-300">Submissions</p>
          <h2 className="text-2xl">{totalSubmissions}</h2>
        </div>

        <div className="border p-4 rounded bg-black/70">
          <p className="text-sm text-green-300">Total Score</p>
          <h2 className="text-2xl">{totalScore}</h2>
        </div>
      </div>

      {/* 🏆 TOP 3 LEADERBOARD */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl">Top Performers</h2>
          <button
            onClick={() => navigate("/admin/leaderboard")}
            className="text-blue-400 text-sm"
          >
            View All →
          </button>
        </div>

        {leaderboard.slice(0, 3).map((user, i) => (
          <div key={i} className="border p-2 mb-2 rounded">
            #{i + 1} | {user.participantId?.name || "Unknown"} |{" "}
            {user.totalScore}
          </div>
        ))}
      </div>

      {/* 🧾 RECENT SUBMISSIONS */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl">Recent Submissions</h2>
          <button
            onClick={() => navigate("/admin/submissions")}
            className="text-blue-400 text-sm"
          >
            View All →
          </button>
        </div>

        {submissions.slice(0, 3).map((s) => (
          <div key={s._id} className="border p-2 mb-2 rounded">
            <p>
              {s.name || s.participantId?.name} →{" "}
              {s.problemTitle || s.problemId?.title}
            </p>
            <p className="text-sm text-green-300">Score: {s.scoreAwarded}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
