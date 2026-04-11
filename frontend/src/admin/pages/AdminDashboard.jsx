// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";

const AdminDashboard = () => {
  const { api } = useContext(RoundContext);

  const [leaderboard, setLeaderboard] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const lb = await api.get("/api/admin/leaderboard");
    const subs = await api.get("/api/admin/submissions");

    setLeaderboard(lb.data);
    setSubmissions(subs.data);
  };

  const giveBonus = async (id) => {
    await api.put(`/api/admin/bonus/${id}`, { points: 5 });
    fetchData();
  };

  return (
    <div className="p-6 text-green-400 bg-black min-h-screen">
      <h1 className="text-3xl mb-6">Admin Panel</h1>

      {/* Leaderboard */}
      <h2 className="text-xl mb-2">Leaderboard</h2>
      {leaderboard.map((user, i) => (
        <div key={i}>
          User: {user._id} | Score: {user.totalScore}
        </div>
      ))}

      {/* Submissions */}
      <h2 className="text-xl mt-6 mb-2">Submissions</h2>
      {submissions.map((s) => (
        <div key={s._id} className="border p-2 mb-2">
          <p>{s.problemId.title}</p>
          <pre>{s.code}</pre>
          <p>Score: {s.scoreAwarded}</p>

          <button onClick={() => giveBonus(s._id)}>Give +5 Bonus</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
