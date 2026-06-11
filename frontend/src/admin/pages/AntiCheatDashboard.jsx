// @ts-nocheck
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { RoundContext } from "../../context/ContextProvider";

const POLL_INTERVAL_MS = 4000;

const categoryColor = {
  SAFE: { text: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10" },
  SUSPICIOUS: { text: "text-yellow-400", border: "border-yellow-500/40", bg: "bg-yellow-500/10" },
  DOUBTFUL: { text: "text-orange-400", border: "border-orange-500/40", bg: "bg-orange-500/10" },
  CONFIRMED: { text: "text-red-400", border: "border-red-500/50", bg: "bg-red-500/10" },
};

const AntiCheatDashboard = () => {
  const { api } = useContext(RoundContext);

  const [activeSessions, setActiveSessions] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [participantLogs, setParticipantLogs] = useState([]);
  const [participantSession, setParticipantSession] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [disqualifyConfirm, setDisqualifyConfirm] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("live"); // live | logs | participants | stats
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const pollRef = useRef(null);

  // ── Fetch live data ────────────────────────────────────────────────────────
  const fetchLive = useCallback(async () => {
    try {
      const res = await api.get("/api/anticheat/admin/live");
      setActiveSessions(res.data.activeSessions || []);
      setRecentLogs(res.data.recentLogs || []);
      setSummary(res.data.summary || null);
      setLastUpdated(new Date());
    } catch { }
  }, [api]);

  useEffect(() => {
    fetchLive();
    pollRef.current = setInterval(fetchLive, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [fetchLive]);

  const fetchParticipants = useCallback(async () => {
    setLoadingParticipants(true);
    try {
      const res = await api.get("/api/anticheat/admin/participants");
      setParticipants(res.data || []);
    } catch { }
    setLoadingParticipants(false);
  }, [api]);

  useEffect(() => {
    if (activeTab === "participants") {
      fetchParticipants();
    }
  }, [activeTab, fetchParticipants]);

  // ── Fetch participant detail ───────────────────────────────────────────────
  const openParticipantDetail = async (participantId) => {
    setSelectedParticipant(participantId);
    setLoadingDetail(true);
    try {
      const res = await api.get(`/api/anticheat/admin/logs/${participantId}`);
      setParticipantLogs(res.data.logs || []);
      setParticipantSession(res.data.session || null);
    } catch { }
    setLoadingDetail(false);
  };

  // ── Force disqualify ──────────────────────────────────────────────────────
  const handleForceDisqualify = async (participantId, round, name) => {
    setDisqualifyConfirm({ participantId, round, name });
  };

  const confirmDisqualify = async () => {
    if (!disqualifyConfirm) return;
    try {
      await api.post("/api/anticheat/admin/disqualify", {
        participantId: disqualifyConfirm.participantId,
        round: disqualifyConfirm.round,
        reason: "Admin manual disqualification",
      });
      setDisqualifyConfirm(null);
      fetchLive();
    } catch { }
  };

  const formatTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour12: false });
  };

  const formatDuration = (startedAt) => {
    if (!startedAt) return "-";
    const diff = Date.now() - new Date(startedAt).getTime();
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m}m ${s}s`;
  };

  return (
    <div className="relative min-h-screen bg-black text-cyan-400 font-mono p-4 sm:p-6 overflow-hidden">
      {/* BG FX */}
      <div className="absolute inset-0 bg-cyan-500/3 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(6,182,212,0.1) 3px)" }} />

      {/* Header with Connection Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-cyan-500/20 pb-6 relative z-10">
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-black tracking-widest text-cyan-500 glitch break-words" data-text="> tail -f /var/log/anticheat">
            {"> tail -f /var/log/anticheat"}<span className="blink text-cyan-500">█</span>
          </h1>
          <p className="text-cyan-500/60 text-xs font-mono uppercase tracking-widest">// NODE_SESSION_MONITORING_ACTIVE</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-sm">
            <span className={`w-2 h-2 rounded-full ${lastUpdated ? 'bg-cyan-500 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
              {lastUpdated ? `LAST_SYNC: ${formatTime(lastUpdated)}` : 'OFFLINE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 tracking-widest uppercase">STATUS:</span>
            <span className="text-xs font-black text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-sm">SECURE</span>
          </div>
        </div>
      </div>

      {/* Confirm disqualify modal */}
      {disqualifyConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm">
          <div className="border border-red-500/60 bg-black p-6 rounded max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            <div className="text-red-400 font-bold text-lg mb-3">⚠️ CONFIRM DISQUALIFY</div>
            <p className="text-green-300/70 text-sm mb-4">
              Force-disqualify <span className="text-red-400 font-bold">{disqualifyConfirm.name}</span> from round {disqualifyConfirm.round}?
              This is irreversible and will freeze their editor.
            </p>
            <div className="flex gap-3">
              <button onClick={confirmDisqualify}
                className="flex-1 bg-red-500/20 border border-red-500 text-red-400 py-2 hover:bg-red-500/30 transition text-sm">
                CONFIRM
              </button>
              <button onClick={() => setDisqualifyConfirm(null)}
                className="flex-1 border border-green-500/30 text-green-400/70 py-2 hover:bg-green-500/5 transition text-sm">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participant detail drawer */}
      {selectedParticipant && (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-black border-l border-cyan-500/20 overflow-y-auto p-5 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-cyan-300 font-bold text-lg">{">"} ./inspect_participant</h2>
            <button onClick={() => setSelectedParticipant(null)} className="text-cyan-500/60 hover:text-cyan-300 text-xl">✕</button>
          </div>

          {loadingDetail ? (
            <div className="text-cyan-500/60 animate-pulse">Loading...</div>
          ) : (
            <>
              {/* Session summary */}
              {participantSession && (
                <div className="border border-cyan-500/20 bg-black/60 p-4 rounded mb-4 space-y-2 text-sm">
                  {[
                    ["Suspicion Score", participantSession.suspicionScore],
                    ["Risk Category", participantSession.riskCategory],
                    ["Cheat Probability", `${participantSession.cheatProbability}%`],
                    ["Trust Score", `${participantSession.trustScore}%`],
                    ["Total Events", participantSession.totalEvents],
                    ["Multi-Tab", participantSession.multiTabDetected ? "YES 🚨" : "No"],
                    ["Tampering", participantSession.tamperingDetected ? "YES 🚨" : "No"],
                    ["Points Deducted", participantSession.pointsDeducted],
                    ["Session Duration", formatDuration(participantSession.startedAt)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-cyan-500/60">{label}</span>
                      <span className={`font-bold ${label === "Risk Category" ? (categoryColor[val]?.text || "text-cyan-300") : "text-cyan-300"
                        }`}>{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Violation timeline */}
              <div className="text-cyan-500/50 text-xs mb-2 mt-6">{">"} Violation Timeline</div>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {participantLogs.map((log, i) => (
                  <div key={i} className={`border-l-2 pl-3 py-1 text-xs ${log.riskCategory === "CONFIRMED" ? "border-red-500" :
                      log.riskCategory === "DOUBTFUL" ? "border-orange-400" :
                        log.riskCategory === "SUSPICIOUS" ? "border-yellow-400" : "border-emerald-500/30"
                    }`}>
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-300 font-bold">{log.eventType}</span>
                      <span className="text-cyan-500/50">{formatTime(log.timestamp)}</span>
                    </div>
                    <div className="text-cyan-500/60 mt-0.5 text-xs">
                      +{log.scoreImpact} pts → score: {log.suspicionScoreAfter}
                      {log.actionTaken !== "none" && (
                        <span className="ml-2 text-orange-400">[{log.actionTaken}]</span>
                      )}
                    </div>
                  </div>
                ))}
                {participantLogs.length === 0 && (
                  <div className="text-cyan-500/40 text-xs">No violations logged.</div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 mb-6 hidden">
        {/* Intentionally hidden, moving to top header to avoid duplicate title feeling */}
      </div>

      {/* ── SUMMARY METRICS ──────────────────────────────────────────────── */}
      {summary && (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "active", value: summary.totalActive, color: "text-cyan-300" },
            { label: "suspicious", value: summary.byCategory?.SUSPICIOUS || 0, color: "text-yellow-400" },
            { label: "doubtful", value: summary.byCategory?.DOUBTFUL || 0, color: "text-orange-400" },
            { label: "confirmed", value: summary.byCategory?.CONFIRMED || 0, color: "text-red-600" },
          ].map((m) => (
            <div key={m.label} className="border border-cyan-500/20 bg-black/60 p-3 rounded">
              <div className="text-cyan-500/50 text-xs">{">"} {m.label}</div>
              <div className={`text-3xl font-bold mt-1 ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex gap-1 border-b border-cyan-500/20 mb-4 overflow-x-auto custom-scrollbar whitespace-nowrap">
        {[
          { id: "live", label: "./live_sessions" },
          { id: "participants", label: "./participants" },
          { id: "events", label: "./event_feed" },
          { id: "stats", label: "./analytics" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm transition-all font-mono font-black uppercase ${activeTab === t.id
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-slate-500 hover:text-cyan-400"
              }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── LIVE SESSIONS TABLE ──────────────────────────────────────────── */}
      {activeTab === "live" && (
        <div className="relative z-10">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[1000px] text-cyan-500/70">
              <thead>
                <tr className="border-b border-cyan-500/20 text-cyan-500/50">
                  {["Participant", "Round", "Score", "Risk", "Probability", "Trust", "Duration", "Flags", "Actions"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 font-mono tracking-widest uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeSessions.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-cyan-500/40 uppercase font-mono tracking-widest">
                      No active monitoring sessions
                    </td>
                  </tr>
                )}
                {activeSessions.map((s) => {
                  const cc = categoryColor[s.riskCategory] || categoryColor.SAFE;
                  return (
                    <tr key={s._id}
                      className={`border-b border-white/5 hover:bg-cyan-500/5 transition cursor-pointer font-mono ${s.riskCategory === "CONFIRMED" ? "bg-red-500/10" :
                          s.riskCategory === "DOUBTFUL" ? "bg-orange-500/5" : ""
                        }`}
                      onClick={() => openParticipantDetail(
                        typeof s.participantId === "object" ? s.participantId._id : s.participantId
                      )}>
                      <td className="py-2 px-3">
                        <div className="text-cyan-300 font-bold uppercase">
                          {s.participantId?.name || "Unknown"}
                        </div>
                        <div className="text-cyan-500/50 text-xs tracking-widest uppercase">{s.participantId?.email || ""}</div>
                      </td>
                      <td className="py-2 px-3 text-cyan-400">R{s.round}</td>
                      <td className="py-2 px-3">
                        <div className={`font-bold ${cc.text}`}>{s.suspicionScore}</div>
                        {/* Mini progress bar */}
                        <div className="h-1 bg-red-500/10 rounded mt-1 w-16">
                          <div className={`h-full rounded ${s.riskCategory === "CONFIRMED" ? "bg-red-500" :
                              s.riskCategory === "DOUBTFUL" ? "bg-orange-400" :
                                s.riskCategory === "SUSPICIOUS" ? "bg-yellow-400" : "bg-green-500"
                            }`} style={{ width: `${Math.min(100, (s.suspicionScore / 100) * 100)}%` }} />
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-sm border ${cc.text} ${cc.border} ${cc.bg}`}>
                          {s.riskCategory}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className={`font-bold ${cc.text}`}>{s.cheatProbability}%</div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-emerald-400">{s.trustScore}%</div>
                      </td>
                      <td className="py-2 px-3 text-cyan-500/60">{formatDuration(s.startedAt)}</td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-0.5 text-xs">
                          {s.isDisqualified && <span className="text-red-500 font-bold underline">🔴 DISQUALIFIED</span>}
                          {s.isFrozen && <span className="text-red-500">🔒 frozen</span>}
                          {s.multiTabDetected && <span className="text-red-400">⚠ multi-tab</span>}
                          {s.tamperingDetected && <span className="text-red-400">⚠ tamper</span>}
                          {s.executionsRestricted && <span className="text-orange-400">⚠ restricted</span>}
                        </div>
                      </td>
                      <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                        {!s.isDisqualified ? (
                          <button
                            onClick={() => handleForceDisqualify(
                              typeof s.participantId === "object" ? s.participantId._id : s.participantId,
                              s.round,
                              s.participantId?.name || "participant"
                            )}
                            className="px-2 py-1 border border-red-500/50 text-red-400 text-xs hover:bg-red-500/10 transition rounded">
                            Disqualify
                          </button>
                        ) : (
                          <span className="text-red-500/60 text-xs">Disqualified</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PARTICIPANTS VIEW ────────────────────────────────────────────── */}
      {activeTab === "participants" && (
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="text-cyan-500/50 text-xs font-mono uppercase tracking-widest">Total participants: {participants.length}</div>
            <button onClick={fetchParticipants} className="text-xs text-cyan-400 hover:underline font-mono uppercase tracking-widest">
              {loadingParticipants ? "./syncing..." : "[ REFRESH_LIST ]"}
            </button>
          </div>
          <div className="overflow-x-auto border border-cyan-500/20 rounded bg-black/40 custom-scrollbar">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[800px] font-mono">
              <thead>
                <tr className="border-b border-cyan-500/20 text-cyan-500/50 text-left uppercase tracking-widest">
                  <th className="py-2 px-3 font-normal">Name / Email</th>
                  <th className="py-2 px-3 font-normal">College</th>
                  <th className="py-2 px-3 font-normal">Max Risk</th>
                  <th className="py-2 px-3 font-normal">Avg Trust</th>
                  <th className="py-2 px-3 font-normal">Total Events</th>
                  <th className="py-2 px-3 font-normal">Violations</th>
                  <th className="py-2 px-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 && !loadingParticipants && (
                  <tr><td colSpan={7} className="py-8 text-center text-cyan-500/40 uppercase tracking-widest">No data found</td></tr>
                )}
                {participants.map((p) => {
                  const stats = p.antiCheat || {};
                  return (
                    <tr key={p._id} className="border-b border-white/5 hover:bg-cyan-500/5 cursor-pointer transition-colors"
                        onClick={() => openParticipantDetail(p._id)}>
                      <td className="py-2 px-3">
                        <div className="text-cyan-300 font-bold uppercase">{p.name}</div>
                        <div className="text-cyan-500/50 text-xs tracking-widest uppercase">{p.email}</div>
                      </td>
                      <td className="py-2 px-3 text-cyan-500/80 uppercase text-xs tracking-widest">{p.college || "N/A"}</td>
                      <td className="py-2 px-3">
                        <span className={`font-bold ${stats.maxSuspicion >= 80 ? "text-red-400" : stats.maxSuspicion >= 50 ? "text-orange-400" : "text-emerald-400"}`}>
                          {stats.maxSuspicion || 0}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-cyan-300">{Math.round(stats.avgTrustScore || 100)}%</td>
                      <td className="py-2 px-3 text-cyan-500/60">{stats.totalEvents || 0}</td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-0.5 text-xs">
                          {stats.multiTabCount > 0 && <span className="text-red-400">multi-tab: {stats.multiTabCount}</span>}
                          {stats.tamperingCount > 0 && <span className="text-red-500">tamper: {stats.tamperingCount}</span>}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        {p.isDisqualified ? (
                          <span className="text-red-500 font-bold border border-red-500/50 px-1 py-0.5 rounded text-xs bg-red-500/5">DISQUALIFIED</span>
                        ) : (
                          <span className="text-emerald-500 text-xs">ACTIVE</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── REAL-TIME EVENT FEED ─────────────────────────────────────────── */}
      {activeTab === "events" && (
        <div className="relative z-10 space-y-1 max-h-[65vh] overflow-y-auto pr-1 custom-scrollbar">
          {recentLogs.length === 0 && (
            <div className="text-cyan-500/40 text-sm py-8 text-center uppercase tracking-widest font-mono">No events recorded yet.</div>
          )}
          {recentLogs.map((log, i) => {
            const cc = categoryColor[log.riskCategory] || categoryColor.SAFE;
            return (
              <div key={i} className={`border-l-2 pl-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 ${log.riskCategory === "CONFIRMED" ? "border-red-500 bg-red-500/5" :
                  log.riskCategory === "DOUBTFUL" ? "border-orange-400 bg-orange-500/5" :
                    log.riskCategory === "SUSPICIOUS" ? "border-yellow-400" : "border-emerald-500/20"
                }`}>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="text-cyan-500/50 text-xs min-w-[60px]">{formatTime(log.timestamp)}</span>
                  <span className="text-cyan-300 font-bold">{log.participantId?.name || "?"}</span>
                  <span className={`font-mono ${cc.text}`}>{log.eventType}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-cyan-500/60">+{log.scoreImpact}pts → {log.suspicionScoreAfter}</span>
                  <span className={`px-1.5 py-0.5 border ${cc.text} ${cc.border} ${cc.bg} rounded text-xs`}>
                    {log.riskCategory}
                  </span>
                  {log.actionTaken !== "none" && (
                    <span className="text-orange-400">[{log.actionTaken}]</span>
                  )}
                  {log.isTampering && <span className="text-red-400 font-bold">TAMPER</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ANALYTICS ────────────────────────────────────────────────────── */}
      {activeTab === "stats" && summary && (
        <div className="relative z-10 grid sm:grid-cols-2 gap-6">
          {/* Category breakdown */}
          <div className="border border-cyan-500/20 bg-black/60 p-4 rounded">
            <div className="text-cyan-500/50 text-xs mb-3">{">"} risk_distribution</div>
            {Object.entries(summary.byCategory || {}).map(([cat, count]) => {
              const total = Math.max(1, summary.totalActive);
              const pct = Math.round((count / total) * 100);
              const cc = categoryColor[cat] || categoryColor.SAFE;
              return (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={cc.text}>{cat}</span>
                    <span className="text-cyan-500/60">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-cyan-500/10 rounded overflow-hidden">
                    <div className={`h-full rounded transition-all duration-500 ${cat === "CONFIRMED" ? "bg-red-500" :
                        cat === "DOUBTFUL" ? "bg-orange-400" :
                          cat === "SUSPICIOUS" ? "bg-yellow-400" : "bg-emerald-500"
                      }`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top violation types */}
          <div className="border border-cyan-500/20 bg-black/60 p-4 rounded">
            <div className="text-cyan-500/50 text-xs mb-3">{">"} top_event_types</div>
            {Object.entries(summary.eventTypeCounts || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([type, count]) => {
                const maxCount = Math.max(...Object.values(summary.eventTypeCounts || {}), 1);
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={type} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-cyan-300 font-mono">{type}</span>
                      <span className="text-cyan-500/60">{count}</span>
                    </div>
                    <div className="h-1.5 bg-cyan-500/10 rounded overflow-hidden">
                      <div className="h-full bg-cyan-400/60 rounded"
                        style={{ width: `${pct}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Summary stats */}
          <div className="border border-cyan-500/20 bg-black/60 p-4 rounded sm:col-span-2">
            <div className="text-cyan-500/50 text-xs mb-3">{">"} system_metrics</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Sessions", value: summary.totalSessions },
                { label: "Disqualified", value: summary.totalDisqualified, warn: true },
                { label: "Tampering Detected", value: summary.totalTamperingDetected, warn: true },
                { label: "Active Now", value: summary.totalActive },
              ].map(({ label, value, warn }) => (
                <div key={label} className="text-center">
                  <div className={`text-2xl font-bold ${warn && value > 0 ? "text-red-400" : "text-cyan-300"}`}>
                    {value}
                  </div>
                  <div className="text-cyan-500/50 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 mt-8 text-xs font-mono tracking-widest uppercase text-cyan-500/40 border-t border-cyan-500/20 pt-3 flex flex-col sm:flex-row gap-2 justify-between items-center text-center sm:text-left">
        <span>{">"} anticheat.engine: v1.0 LIVE</span>
        <span className="animate-pulse">{">"} polling: {POLL_INTERVAL_MS / 1000}s interval</span>
      </div>
    </div>
  );
};

export default AntiCheatDashboard;
