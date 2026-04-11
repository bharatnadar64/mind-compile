// @ts-nocheck
// admin/pages/Leaderboard.jsx
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getLeaderboard } from "../services/adminApi";

const Leaderboard = () => {
  const { api } = useContext(RoundContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard(api);
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <h1 className="text-2xl mb-4">Leaderboard</h1>

      {data.map((user, i) => (
        <div key={i} className="border p-3 mb-2">
          Rank {i + 1} | User: {user._id} | Score: {user.totalScore}
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
