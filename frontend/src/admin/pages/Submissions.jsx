// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getSubmissions, giveBonus } from "../services/adminApi";

const Submissions = () => {
  const { api } = useContext(RoundContext);

  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roundFilter, setRoundFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // 🚀 FETCH DATA
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // 🔍 APPLY FILTERS
  useEffect(() => {
    applyFilters();
  }, [search, roundFilter, submissions]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      const res = await getSubmissions(api);

      // ✅ HANDLE BOTH CASES (array OR { submissions: [] })
      const data = res?.submissions || res || [];

      setSubmissions(data);
      setFiltered(data);

      console.log("DEBUG submissions:", data); // 🔍 debug once
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FILTER LOGIC
  const applyFilters = () => {
    let data = [...submissions];

    if (search) {
      const query = search.toLowerCase();

      data = data.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(query) ||
          (s.email || "").toLowerCase().includes(query) ||
          (s.problemTitle || "").toLowerCase().includes(query),
      );
    }

    if (roundFilter !== "all") {
      data = data.filter((s) => (s.round || "").toString() === roundFilter);
    }

    setFiltered(data);
  };

  // 🎯 BONUS
  const handleBonus = async (id) => {
    try {
      await giveBonus(api, id, 5);
      fetchSubmissions();
    } catch (err) {
      console.log("Bonus error:", err);
    }
  };

  // 📋 COPY CODE
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <h1 className="text-2xl mb-4">Submissions</h1>

      {/* 🔍 FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search user / problem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black border border-green-500 px-3 py-2 flex-1"
        />

        <select
          value={roundFilter}
          onChange={(e) => setRoundFilter(e.target.value)}
          className="bg-black border border-green-500 px-3 py-2"
        >
          <option value="all">All Rounds</option>
          <option value="1.1">Round 1.1</option>
          <option value="1.2">Round 1.2</option>
          <option value="2">Round 2</option>
          <option value="3">Round 3</option>
        </select>
      </div>

      {/* ⏳ LOADING */}
      {loading ? (
        <p>Loading submissions...</p>
      ) : filtered.length === 0 ? (
        <p>No submissions found...</p>
      ) : (
        filtered.map((s) => (
          <div
            key={s._id}
            className="border border-green-500/40 p-4 mb-4 rounded bg-black/70"
          >
            {/* HEADER */}
            <div className="flex justify-between flex-wrap gap-2">
              <p>
                👤 {s.name || "Unknown"} ({s.email || "No email"})
              </p>

              <p>🏁 Round: {s.round || "N/A"}</p>
            </div>

            <p className="mt-1">💻 Problem: {s.problemTitle || "Unknown"}</p>

            <p className="mt-1">
              🎯 Score:{" "}
              <span className="text-green-300">{s.scoreAwarded ?? 0}</span>
            </p>

            {/* CODE */}
            <pre className="bg-black border border-green-500/30 p-3 mt-3 text-sm overflow-x-auto max-h-60">
              {s.code || "// No code"}
            </pre>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleBonus(s._id)}
                className="px-3 py-1 bg-green-500 text-black hover:bg-green-400"
              >
                +5 Bonus
              </button>

              <button
                onClick={() => copyCode(s.code)}
                className="px-3 py-1 border border-green-400"
              >
                Copy Code
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Submissions;
