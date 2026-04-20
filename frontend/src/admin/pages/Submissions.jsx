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

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, roundFilter, submissions]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await getSubmissions(api);

      const data = res?.submissions || res || [];

      setSubmissions(data);
      setFiltered(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...submissions];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q) ||
          (s.problemTitle || "").toLowerCase().includes(q),
      );
    }

    if (roundFilter !== "all") {
      data = data.filter((s) => (s.round || "").toString() === roundFilter);
    }

    setFiltered(data);
  };

  const handleBonus = async (id) => {
    await giveBonus(api, id, 5);
    fetchSubmissions();
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative min-h-screen bg-black text-green-400 font-mono p-6 overflow-hidden">
      {/* glow */}
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 pointer-events-none" />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.12) 3px)",
        }}
      />

      {/* HEADER */}
      <div className="relative z-10 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-green-300 drop-shadow-[0_0_12px_#00ff00]">
          {"> SUBMISSION INTELLIGENCE FEED"}
        </h1>
        <p className="text-green-500/60 text-sm mt-1">
          live forensic analysis of participant code
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="relative z-10 flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="> search.user / problem / email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black border border-green-500/40 px-3 py-2 flex-1 focus:outline-none"
        />

        <select
          value={roundFilter}
          onChange={(e) => setRoundFilter(e.target.value)}
          className="bg-black border border-green-500/40 px-3 py-2"
        >
          <option value="all">all.rounds</option>
          <option value="1.1">round.1.1</option>
          <option value="1.2">round.1.2</option>
          <option value="2">round.2</option>
          <option value="3">round.3</option>
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="relative z-10 animate-pulse">
          {"> scanning.submissions..."}
        </p>
      ) : filtered.length === 0 ? (
        <p className="relative z-10 text-green-500/60">
          {"> no matching records found"}
        </p>
      ) : (
        <div className="relative z-10 space-y-6">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="border border-green-500/30 bg-black/70 p-4 rounded"
            >
              {/* HEADER */}
              <div className="flex justify-between flex-wrap gap-2 text-sm">
                <p>
                  {"> user:"} {s.name || "unknown"} ({s.email || "n/a"})
                </p>
                <p>
                  {"> round:"} {s.round || "n/a"}
                </p>
              </div>

              <p className="mt-1 text-green-300">
                {"> problem:"} {s.problemTitle || "unknown"}
              </p>

              <p className="mt-1">
                {"> score:"}{" "}
                <span className="text-green-300 font-bold">
                  {s.scoreAwarded ?? 0}
                </span>
              </p>

              {/* CODE BLOCK */}
              <div className="mt-3 border border-green-500/20 bg-black p-3 max-h-60 overflow-auto text-sm relative">
                {/* faint header */}
                <div className="text-green-500/40 mb-2 text-xs">
                  {"> code.payload"}
                </div>

                <pre className="whitespace-pre-wrap">
                  {s.code || "// empty payload"}
                </pre>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-3 text-sm">
                <button
                  onClick={() => handleBonus(s._id)}
                  className="px-3 py-1 border border-green-400 hover:bg-green-400 hover:text-black transition"
                >
                  +bonus
                </button>

                <button
                  onClick={() => copyCode(s.code)}
                  className="px-3 py-1 border border-green-500/40 hover:border-green-300"
                >
                  copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER STATUS */}
      <div className="relative z-10 mt-8 text-xs text-green-500/60 flex justify-between border-t border-green-500/10 pt-3">
        <span>{"> stream.status: ACTIVE"}</span>
        <span className="animate-pulse">{"> analyzing.code..."}</span>
      </div>
    </div>
  );
};

export default Submissions;
