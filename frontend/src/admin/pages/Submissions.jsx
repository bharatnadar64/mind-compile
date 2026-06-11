// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getSubmissions, getRounds, giveBonus } from "../services/adminApi";
import { motion, AnimatePresence } from "framer-motion";

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
      console.error(err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-mono tracking-widest text-xs animate-pulse uppercase">Syncing_Submission_Nodes...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-slate-300 font-mono p-4 sm:p-10 overflow-hidden">
      {/* ===== BACKGROUND FX ===== */}
      <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, #06b6d4 3px)",
        }}
      />

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-10 relative z-10">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-mono font-black tracking-widest text-cyan-500 glitch break-words" data-text="> tail -f /var/log/transmissions">
            {"> tail -f /var/log/transmissions"}<span className="blink text-cyan-500">█</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <p className="text-cyan-500/60 text-xs font-black uppercase tracking-[0.4em]">// LIVE_INTELLIGENCE_FEED</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="[ SEARCH_NODE_OR_USER ]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black/50 border border-white/10 px-6 py-4 text-xs font-black tracking-[0.2em] text-cyan-400 focus:border-cyan-500/50 focus:outline-none transition-all w-full md:w-80"
          />
          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            className="bg-black/50 border border-white/10 px-6 py-4 text-xs font-black tracking-[0.2em] text-cyan-400 focus:border-cyan-500/50 focus:outline-none transition-all"
          >
            {roundOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== LIST ===== */}
      <div className="relative z-10 space-y-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-white/5 bg-white/[0.01]">
            <p className="text-slate-600 text-xs font-black tracking-[0.5em] uppercase">NO_TRANSMISSIONS_MATCH_PARAMETERS</p>
          </div>
        ) : (
          filtered.map((s) => (
            <div
              key={s._id}
              className="group relative p-8 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-500"
              style={{ clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 2% 100%, 0 80%)" }}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                {/* Participant Info */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl font-black text-cyan-400">
                      {s.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-widest uppercase">{s.name || "UNKNOWN_NODE"}</h2>
                      <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">{s.email || "NO_ID_ATTACHED"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">PHASE</span>
                      <p className="text-sm font-black text-white">ROUND_{s.round || "0"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">TARGET_PROBLEM</span>
                      <p className="text-sm font-black text-white truncate max-w-[150px] uppercase">{s.problemTitle || "UNDEFINED"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">YIELD_SCORE</span>
                      <p className="text-sm font-black text-emerald-400 tabular-nums">+{s.scoreAwarded ?? 0}_PTS</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">TIMESTAMP</span>
                      <p className="text-sm font-black text-slate-400 tabular-nums">{new Date(s.submittedAt || Date.now()).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col justify-end gap-3 min-w-[200px]">
                  {(() => {
                    const rowKey = `${s.participantId}-${s.round}`;
                    const rowBonus = bonusMap[rowKey] || { bonus5Awarded: false, bonus2Awarded: false };
                    const canGiveBonus = s.scoreAwarded > 0;
                    return (
                      <>
                        <button
                          onClick={() => handleBonus(s._id, 5)}
                          disabled={!canGiveBonus || rowBonus.bonus5Awarded}
                          className={`py-3 px-6 text-xs font-black tracking-widest transition-all uppercase ${
                            !canGiveBonus || rowBonus.bonus5Awarded
                              ? "bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          }`}
                        >
                          {rowBonus.bonus5Awarded ? "BONUS_05_SENT" : "+05_CLEAN_CODE"}
                        </button>
                        <button
                          onClick={() => handleBonus(s._id, 2)}
                          disabled={!canGiveBonus || rowBonus.bonus2Awarded}
                          className={`py-3 px-6 text-xs font-black tracking-widest transition-all uppercase ${
                            !canGiveBonus || rowBonus.bonus2Awarded
                              ? "bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20"
                          }`}
                        >
                          {rowBonus.bonus2Awarded ? "BONUS_02_SENT" : "+02_MODULARITY"}
                        </button>
                      </>
                    );
                  })()}
                  <button
                    onClick={() => copyCode(s.code)}
                    className="py-3 px-6 bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all font-black text-xs tracking-widest uppercase"
                  >
                    EXTRACT_CODE_
                  </button>
                </div>
              </div>

              {/* Code Payload Viewport */}
              <div className="mt-8 border border-white/5 bg-black/40 p-6 relative group/code">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none opacity-20" />
                <span className="text-[10px] font-black text-slate-700 tracking-[0.5em] mb-4 block uppercase underline underline-offset-4">PAYLOAD_BUFFER_SOURCE</span>
                <pre className="text-xs sm:text-sm font-mono text-emerald-500/80 max-h-48 overflow-auto custom-scrollbar whitespace-pre-wrap leading-relaxed">
                  {s.code || "// NO_PAYLOAD_DETECTED"}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== SYSTEM STATUS ===== */}
      <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500 tracking-[0.3em] border-t border-white/5 pt-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span>ENCRYPTION: AES-256-NODE</span>
          </div>
          <span>TOTAL_PACKETS: {submissions.length}</span>
        </div>
        <div className="text-cyan-500/60 animate-pulse">SYSTEM_INTACT // STANDBY_FOR_NEXT_TRANSMISSION</div>
      </div>
    </div>
  );
};

export default Submissions;
