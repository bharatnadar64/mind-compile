// @ts-nocheck
// admin/pages/Submissions.jsx
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getSubmissions, giveBonus } from "../services/adminApi";

const Submissions = () => {
  const { api } = useContext(RoundContext);

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await getSubmissions(api);
      setSubmissions(res);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBonus = async (id) => {
    await giveBonus(api, id, 5);
    fetchSubmissions();
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <h1 className="text-2xl mb-4">Submissions</h1>

      {submissions.map((s) => (
        <div key={s._id} className="border p-4 mb-4">
          <p>User: {s.participantId?.email}</p>
          <p>Problem: {s.problemId?.title}</p>
          <p>Score: {s.scoreAwarded}</p>

          <pre className="bg-black border p-2 mt-2 text-sm overflow-x-auto">
            {s.code}
          </pre>

          <button
            onClick={() => handleBonus(s._id)}
            className="mt-2 px-3 py-1 bg-green-500 text-black"
          >
            +5 Bonus
          </button>
        </div>
      ))}
    </div>
  );
};

export default Submissions;
