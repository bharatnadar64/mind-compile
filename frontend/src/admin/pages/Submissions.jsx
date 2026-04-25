// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getSubmissions, getRounds, giveBonus } from "../services/adminApi";

const Submissions = () => {
  const { api } = useContext(RoundContext);

  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [bonusMap, setBonusMap] = useState({});
  const [roundOptions, setRoundOptions] = useState([
    { value: "all", label: "All Rounds" },
  ]);
  const [search, setSearch] = useState("");
  const [roundFilter, setRoundFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRounds();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, roundFilter, submissions]);

  const buildBonusMap = (data) => {
    return data.reduce((map, s) => {
      if (!s.participantId) return map;
      const key = `${s.participantId}-${s.round}`;
      const existing = map[key] || {
        bonus5Awarded: false,
        bonus2Awarded: false,
      };
      return {
        ...map,
        [key]: {
          bonus5Awarded: existing.bonus5Awarded || Boolean(s.bonus5Awarded),
          bonus2Awarded: existing.bonus2Awarded || Boolean(s.bonus2Awarded),
        },
      };
    }, {});
  };

  const fetchRounds = async () => {
    try {
      const roundData = await getRounds(api);
      const sortedRounds = Array.isArray(roundData)
        ? [...roundData].sort(
            (a, b) => Number(a.roundNumber) - Number(b.roundNumber),
          )
        : [];

      const options = [
        { value: "all", label: "All Rounds" },
        ...sortedRounds.map((round) => ({
          value: String(round.roundNumber),
          label: round.name
            ? `Round ${round.roundNumber} — ${round.name}`
            : `Round ${round.roundNumber}`,
        })),
      ];

      setRoundOptions(options);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await getSubmissions(api);

      const data = res?.submissions || res || [];
      setSubmissions(data);
      setFiltered(data);
      setBonusMap(buildBonusMap(data));
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

  const handleBonus = async (id, points) => {
    try {
      await giveBonus(api, id, points);
      await fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative min-h-screen bg-black text-green-300 font-mono p-4 sm:p-6 overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-green-500/10 blur-3xl opacity-20 pointer-events-none animate-pulse" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.10) 3px)",
        }}
      />

      {/* ===== HEADER ===== */}
      <div className="relative z-10 mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-green-200 drop-shadow-[0_0_12px_rgba(0,255,0,0.5)]">
          Submission Intelligence Feed
        </h1>

        <p className="text-green-500/60 text-xs sm:text-sm mt-1">
          Live forensic analysis of submitted code payloads
        </p>
      </div>

      {/* ===== FILTER PANEL ===== */}
      <div className="relative z-10 flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by user, email, problem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
          bg-black
          border border-green-500/30
          px-3 py-2
          w-full
          focus:outline-none focus:ring-1 focus:ring-green-400
          text-green-200
          rounded
        "
        />

        <select
          value={roundFilter}
          onChange={(e) => setRoundFilter(e.target.value)}
          className="
          bg-black
          border border-green-500/30
          px-3 py-2
          text-green-200
          rounded
          focus:outline-none focus:ring-1 focus:ring-green-400
        "
        >
          {roundOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ===== STATES ===== */}
      {loading ? (
        <p className="relative z-10 animate-pulse text-green-400/70">
          Scanning submission database...
        </p>
      ) : filtered.length === 0 ? (
        <p className="relative z-10 text-green-500/60">
          No matching submission records found
        </p>
      ) : (
        <div className="relative z-10 space-y-4">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="
              border border-green-500/20
              bg-black/60
              p-4
              rounded
              hover:border-green-400/30
              transition
              duration-200
            "
            >
              {/* ===== META HEADER ===== */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm text-green-400/80">
                <span>
                  User:{" "}
                  <span className="text-green-200">{s.name || "unknown"}</span>{" "}
                  ({s.email || "n/a"})
                </span>

                <span>
                  Round:{" "}
                  <span className="text-green-200">{s.round || "n/a"}</span>
                </span>
              </div>

              {/* problem */}
              <p className="mt-2 text-green-200 text-sm sm:text-base">
                Problem: {s.problemTitle || "unknown"}
              </p>

              {/* score */}
              <p className="mt-1 text-sm">
                Score:{" "}
                <span className="text-green-300 font-bold">
                  {s.scoreAwarded ?? 0}
                </span>
              </p>

              {/* ===== CODE BLOCK ===== */}
              <div
                className="
              mt-3
              border border-green-500/20
              bg-black
              p-3
              rounded
              max-h-56 overflow-auto
            "
              >
                <div className="text-green-500/40 text-xs mb-2">
                  Code Payload
                </div>

                <pre className="text-xs sm:text-sm whitespace-pre-wrap text-green-300">
                  {s.code || "// empty payload"}
                </pre>
              </div>

              {/* ===== ACTIONS ===== */}
              <div className="flex flex-wrap gap-3 mt-3 text-sm">
                {(() => {
                  const rowKey = `${s.participantId}-${s.round}`;
                  const rowBonus = bonusMap[rowKey] || {
                    bonus5Awarded: false,
                    bonus2Awarded: false,
                  };
                  const canGiveBonus = s.scoreAwarded > 0;
                  return (
                    <>
                      <button
                        onClick={() => handleBonus(s._id, 5)}
                        disabled={!canGiveBonus || rowBonus.bonus5Awarded}
                        className={
                          `px-3 py-1 border rounded transition active:scale-95 ` +
                          `border-green-400/40 ${
                            !canGiveBonus || rowBonus.bonus5Awarded
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-green-400/10"
                          }`
                        }
                      >
                        +5 Clean Code
                      </button>

                      <button
                        onClick={() => handleBonus(s._id, 2)}
                        disabled={!canGiveBonus || rowBonus.bonus2Awarded}
                        className={
                          `px-3 py-1 border rounded transition active:scale-95 ` +
                          `border-green-400/40 ${
                            !canGiveBonus || rowBonus.bonus2Awarded
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-green-400/10"
                          }`
                        }
                      >
                        +2 Clean Code
                      </button>
                    </>
                  );
                })()}

                <button
                  onClick={() => copyCode(s.code)}
                  className="
                  px-3 py-1
                  border border-green-500/30
                  hover:border-green-300
                  active:scale-95
                  transition
                  rounded
                "
                >
                  Copy Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="relative z-10 mt-8 text-xs text-green-500/60 flex justify-between border-t border-green-500/10 pt-3">
        <span>stream.status: ACTIVE</span>
        <span className="text-green-400/70 animate-pulse">
          analyzing submissions...
        </span>
      </div>
    </div>
  );
};

export default Submissions;
