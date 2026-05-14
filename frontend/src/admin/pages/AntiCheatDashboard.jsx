// @ts-nocheck
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { RoundContext } from "../../context/ContextProvider";

const POLL_INTERVAL_MS = 4000;

const categoryColor = {
  SAFE: { text: "text-green-400", border: "border-green-500/40", bg: "bg-green-500/10" },
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
  const [activeTab, setActiveTab] = useState("live"); // live | logs | history
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
    <div className="relative min-h-screen bg-black text-green-400 font-mono p-4 sm:p-6 overflow-hidden">
      {/* BG FX */}
      <div className="absolute inset-0 bg-red-500/3 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,0,0,0.1) 3px)" }} />

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
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-black border-l border-green-500/20 overflow-y-auto p-5 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-green-300 font-bold text-lg">{">"} Participant Detail</h2>
            <button onClick={() => setSelectedParticipant(null)} className="text-green-500/60 hover:text-green-300 text-xl">✕</button>
          </div>

          {loadingDetail ? (
            <div className="text-green-500/60 animate-pulse">Loading...</div>
          ) : (
            <>
              {/* Session summary */}
              {participantSession && (
                <div className="border border-green-500/20 bg-black/60 p-4 rounded mb-4 space-y-2 text-sm">
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
                      <span className="text-green-500/60">{label}</span>
                      <span className={`font-bold ${label === "Risk Category" ? (categoryColor[val]?.text || "text-green-300") : "text-green-300"
                        }`}>{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Violation timeline */}
              <div className="text-green-500/50 text-xs mb-2">{">"} Violation Timeline</div>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {participantLogs.map((log, i) => (
                  <div key={i} className={`border-l-2 pl-3 py-1 text-xs ${log.riskCategory === "CONFIRMED" ? "border-red-500" :
                      log.riskCategory === "DOUBTFUL" ? "border-orange-400" :
                        log.riskCategory === "SUSPICIOUS" ? "border-yellow-400" : "border-green-500/30"
                    }`}>
                    <div className="flex justify-between">
                      <span className="text-green-300 font-bold">{log.eventType}</span>
                      <span className="text-green-500/50">{formatTime(log.timestamp)}</span>
                    </div>
                    <div className="text-green-500/60 mt-0.5">
                      +{log.scoreImpact} pts → score: {log.suspicionScoreAfter}
                      {log.actionTaken !== "none" && (
                        <span className="ml-2 text-orange-400">[{log.actionTaken}]</span>
                      )}
                    </div>
                  </div>
                ))}
                {participantLogs.length === 0 && (
                  <div className="text-green-500/40 text-xs">No violations logged.</div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-red-400 flex items-center gap-2">
          <span>{">"}</span>
          <span>ANTI-CHEAT</span>
          <span className="text-green-400">::PROCTORING</span>
          <span className="animate-pulse">_</span>
        </h1>
        <div className="mt-1 flex gap-4 text-xs text-green-500/60 flex-wrap">
          <span>{">"} engine: ACTIVE</span>
          <span>{">"} sessions: {activeSessions.length} live</span>
          {lastUpdated && (
            <span className="text-green-500/40">{">"} last_sync: {lastUpdated.toLocaleTimeString("en-IN", { hour12: false })}</span>
          )}
        </div>
      </div>

      {/* ── SUMMARY METRICS ──────────────────────────────────────────────── */}
      {summary && (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "active", value: summary.totalActive, color: "text-green-300" },
            { label: "suspicious", value: summary.byCategory?.SUSPICIOUS || 0, color: "text-yellow-400" },
            { label: "doubtful", value: summary.byCategory?.DOUBTFUL || 0, color: "text-orange-400" },
            { label: "confirmed", value: summary.byCategory?.CONFIRMED || 0, color: "text-red-400" },
          ].map((m) => (
            <div key={m.label} className="border border-green-500/20 bg-black/60 p-3 rounded">
              <div className="text-green-500/50 text-xs">{">"} {m.label}</div>
              <div className={`text-3xl font-bold mt-1 ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex gap-1 border-b border-green-500/20 mb-4">
        {[
          { id: "live", label: "Live Sessions" },
          { id: "events", label: "Event Feed" },
          { id: "stats", label: "Analytics" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm transition-all ${activeTab === t.id
                ? "border-b-2 border-green-400 text-green-300"
                : "text-green-500/50 hover:text-green-400"
              }`}>
            {">"} {t.label}
          </button>
        ))}
      </div>

      {/* ── LIVE SESSIONS TABLE ──────────────────────────────────────────── */}
      {activeTab === "live" && (
        <div className="relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-green-500/20 text-green-500/50">
                  {["Participant", "Round", "Score", "Risk", "Probability", "Trust", "Duration", "Flags", "Actions"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeSessions.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-green-500/40">
                      No active monitoring sessions
                    </td>
                  </tr>
                )}
                {activeSessions.map((s) => {
                  const cc = categoryColor[s.riskCategory] || categoryColor.SAFE;
                  return (
                    <tr key={s._id}
                      className={`border-b border-green-500/10 hover:bg-green-500/5 transition cursor-pointer ${s.riskCategory === "CONFIRMED" ? "bg-red-500/5" :
                          s.riskCategory === "DOUBTFUL" ? "bg-orange-500/5" : ""
                        }`}
                      onClick={() => openParticipantDetail(
                        typeof s.participantId === "object" ? s.participantId._id : s.participantId
                      )}>
                      <td className="py-2 px-3">
                        <div className="text-green-300 font-bold">
                          {s.participantId?.name || "Unknown"}
                        </div>
                        <div className="text-green-500/50 text-xs">{s.participantId?.email || ""}</div>
                      </td>
                      <td className="py-2 px-3 text-green-400">R{s.round}</td>
                      <td className="py-2 px-3">
                        <div className={`font-bold ${cc.text}`}>{s.suspicionScore}</div>
                        {/* Mini progress bar */}
                        <div className="h-1 bg-green-500/10 rounded mt-1 w-16">
                          <div className={`h-full rounded ${s.riskCategory === "CONFIRMED" ? "bg-red-500" :
                              s.riskCategory === "DOUBTFUL" ? "bg-orange-400" :
                                s.riskCategory === "SUSPICIOUS" ? "bg-yellow-400" : "bg-green-500"
                            }`} style={{ width: `${Math.min(100, (s.suspicionScore / 100) * 100)}%` }} />
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs border ${cc.text} ${cc.border} ${cc.bg}`}>
                          {s.riskCategory}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className={`font-bold ${cc.text}`}>{s.cheatProbability}%</div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-green-400">{s.trustScore}%</div>
                      </td>
                      <td className="py-2 px-3 text-green-500/60">{formatDuration(s.startedAt)}</td>
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

      {/* ── REAL-TIME EVENT FEED ─────────────────────────────────────────── */}
      {activeTab === "events" && (
        <div className="relative z-10 space-y-1 max-h-[65vh] overflow-y-auto pr-1">
          {recentLogs.length === 0 && (
            <div className="text-green-500/40 text-sm py-8 text-center">No events recorded yet.</div>
          )}
          {recentLogs.map((log, i) => {
            const cc = categoryColor[log.riskCategory] || categoryColor.SAFE;
            return (
              <div key={i} className={`border-l-2 pl-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 ${log.riskCategory === "CONFIRMED" ? "border-red-500 bg-red-500/5" :
                  log.riskCategory === "DOUBTFUL" ? "border-orange-400 bg-orange-500/5" :
                    log.riskCategory === "SUSPICIOUS" ? "border-yellow-400" : "border-green-500/20"
                }`}>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="text-green-500/50 text-xs min-w-[60px]">{formatTime(log.timestamp)}</span>
                  <span className="text-green-300 font-bold">{log.participantId?.name || "?"}</span>
                  <span className={`font-mono ${cc.text}`}>{log.eventType}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-500/60">+{log.scoreImpact}pts → {log.suspicionScoreAfter}</span>
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
          <div className="border border-green-500/20 bg-black/60 p-4 rounded">
            <div className="text-green-500/50 text-xs mb-3">{">"} risk_distribution</div>
            {Object.entries(summary.byCategory || {}).map(([cat, count]) => {
              const total = Math.max(1, summary.totalActive);
              const pct = Math.round((count / total) * 100);
              const cc = categoryColor[cat] || categoryColor.SAFE;
              return (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={cc.text}>{cat}</span>
                    <span className="text-green-500/60">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-green-500/10 rounded overflow-hidden">
                    <div className={`h-full rounded transition-all duration-500 ${cat === "CONFIRMED" ? "bg-red-500" :
                        cat === "DOUBTFUL" ? "bg-orange-400" :
                          cat === "SUSPICIOUS" ? "bg-yellow-400" : "bg-green-500"
                      }`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top violation types */}
          <div className="border border-green-500/20 bg-black/60 p-4 rounded">
            <div className="text-green-500/50 text-xs mb-3">{">"} top_event_types</div>
            {Object.entries(summary.eventTypeCounts || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([type, count]) => {
                const maxCount = Math.max(...Object.values(summary.eventTypeCounts || {}), 1);
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={type} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-green-300 font-mono">{type}</span>
                      <span className="text-green-500/60">{count}</span>
                    </div>
                    <div className="h-1.5 bg-green-500/10 rounded overflow-hidden">
                      <div className="h-full bg-green-400/60 rounded"
                        style={{ width: `${pct}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Summary stats */}
          <div className="border border-green-500/20 bg-black/60 p-4 rounded sm:col-span-2">
            <div className="text-green-500/50 text-xs mb-3">{">"} system_metrics</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Sessions", value: summary.totalSessions },
                { label: "Disqualified", value: summary.totalDisqualified, warn: true },
                { label: "Tampering Detected", value: summary.totalTamperingDetected, warn: true },
                { label: "Active Now", value: summary.totalActive },
              ].map(({ label, value, warn }) => (
                <div key={label} className="text-center">
                  <div className={`text-2xl font-bold ${warn && value > 0 ? "text-red-400" : "text-green-300"}`}>
                    {value}
                  </div>
                  <div className="text-green-500/50 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 mt-8 text-xs text-green-500/40 border-t border-green-500/10 pt-3 flex justify-between">
        <span>{">"} anticheat.engine: v1.0 LIVE</span>
        <span className="animate-pulse">{">"} polling: {POLL_INTERVAL_MS / 1000}s interval</span>
      </div>
    </div>
  );
};

export default AntiCheatDashboard;
