// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { RoundContext } from "../../context/ContextProvider";

const AdminRounds = () => {
  const { api } = useContext(RoundContext);

  const [rounds, setRounds] = useState([]);
  const [editingRound, setEditingRound] = useState(null);
  const [creatingRound, setCreatingRound] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRounds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/rounds");
      setRounds(res.data);
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/api/rounds/${id}`);
    fetchRounds();
  };

  const handleUpdate = async () => {
    await api.put(`/api/rounds/${editingRound._id}`, editingRound);
    setEditingRound(null);
    fetchRounds();
  };

  const handleCreate = async () => {
    await api.post("/api/rounds", creatingRound);
    setCreatingRound(null);
    fetchRounds();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-mono tracking-widest text-xs animate-pulse">DECRYPTING_PHASE_DATA...</p>
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
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-mono font-black tracking-widest text-cyan-500 glitch break-words" data-text="> ./configure --rounds">
            {"> ./configure --rounds"}<span className="blink text-cyan-500">█</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <p className="text-cyan-500/60 text-xs font-black uppercase tracking-[0.4em]">// DEPLOYMENT_PROTOCOL_v4.2</p>
          </div>
        </div>

        <button
          onClick={() =>
            setCreatingRound({
              roundNumber: "",
              name: "",
              timeLimit: "",
              executionAllowed: true,
              maxExecutions: "",
              baseScore: "",
              bonusFirst: "",
              bonusCleanCode: "",
            })
          }
          className="w-full md:w-auto px-10 py-4 bg-cyan-500 text-black font-black text-xs tracking-[0.3em] hover:bg-cyan-400 transition-all uppercase shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
        >
          [+] ./init_new_phase
        </button>
      </div>

      {/* ===== ROUND LIST ===== */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rounds.map((r, idx) => (
          <div
            key={`${r._id}-${idx}`}
            className="group relative p-1 bg-white/[0.01] border border-white/5 hover:border-cyan-500/30 transition-all duration-500"
            style={{ clipPath: "polygon(0 0, 92% 0, 100% 10%, 100% 100%, 8% 100%, 0 90%)" }}
          >
            <div className="bg-slate-950 p-8 h-full" style={{ clipPath: "polygon(0 0, 92% 0, 100% 10%, 100% 100%, 8% 100%, 0 90%)" }}>
              <div className="absolute top-4 right-8 text-6xl font-black text-white/[0.02] group-hover:text-cyan-500/[0.05] transition-colors pointer-events-none">
                {r.roundNumber.toString().padStart(2, '0')}
              </div>

              <div className="flex flex-col h-full relative z-10">
                <div className="mb-10">
                  <span className="text-[10px] font-bold text-cyan-500 tracking-[0.3em] mb-2 block uppercase">PHASE_IDENTIFIER</span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors uppercase truncate">
                    {r.name || "UNNAMED_UNIT"}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-12">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">TEMPORAL_LIMIT</span>
                    <p className="text-sm font-black text-slate-300 tabular-nums">{r.timeLimit}M_ALLOC</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">BASE_YIELD</span>
                    <p className="text-sm font-black text-slate-300 tabular-nums">{r.baseScore}PTS_VAL</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">REMOTE_EXEC</span>
                    <p className={`text-sm font-black ${r.executionAllowed ? 'text-emerald-400' : 'text-blue-500'}`}>
                      {r.executionAllowed ? `AUTH [${r.maxExecutions}]` : "TERMINATED"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">NODE_STATUS</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                      <p className="text-sm font-black text-slate-300 uppercase">ACTIVE</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex gap-4">
                  <button
                    onClick={() => setEditingRound({ ...r })}
                    className="flex-1 py-4 bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-black text-xs tracking-widest uppercase"
                  >
                    MODIFY_PARAMS_
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="px-6 py-4 border border-blue-500/10 text-blue-500/40 hover:text-blue-500 hover:bg-blue-500/5 transition-all font-black text-xs tracking-widest uppercase"
                  >
                    PURGE_
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== EDIT PANEL (MODAL) ===== */}
      {editingRound && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-cyan-500/30 p-6 sm:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
               style={{ clipPath: "polygon(0 0, 97% 0, 100% 5%, 100% 100%, 3% 100%, 0 95%)" }}>
            
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <h2 className="text-lg sm:text-xl font-mono font-black text-cyan-500 tracking-widest uppercase">
                {"> ./reconfigure_phase_0"}{editingRound.roundNumber}<span className="blink text-cyan-500">█</span>
              </h2>
              <button onClick={() => setEditingRound(null)} className="text-slate-500 hover:text-white transition-colors text-xs font-mono tracking-widest">[ ABORT_ESC ]</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {["name", "timeLimit", "baseScore", "maxExecutions"].map((field) => (
                <div key={field} className="space-y-3">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest">{field.toUpperCase()}_STRING</label>
                  <input
                    className="bg-black/50 border border-white/10 p-5 w-full text-white focus:border-cyan-500/50 focus:outline-none transition-all font-mono text-sm"
                    value={editingRound[field]}
                    onChange={(e) =>
                      setEditingRound({
                        ...editingRound,
                        [field]: isNaN(e.target.value) || e.target.value === "" ? e.target.value : Number(e.target.value),
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white/[0.02] border border-white/5">
              <label className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-6 h-6 accent-cyan-500 bg-black border-white/10"
                  checked={editingRound.executionAllowed}
                  onChange={(e) =>
                    setEditingRound({
                      ...editingRound,
                      executionAllowed: e.target.checked,
                    })
                  }
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-300 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">
                    AUTHORIZE_REMOTE_EXECUTION
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Enables code testing nodes for this phase</span>
                </div>
              </label>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <button onClick={handleUpdate} className="flex-1 py-5 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-black text-sm tracking-[0.3em] hover:bg-cyan-500/40 transition-all uppercase shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                ./COMMIT_DATA_PACKET
              </button>
              <button onClick={() => setEditingRound(null)} className="px-10 py-5 border border-white/10 text-slate-500 font-black text-xs tracking-[0.3em] hover:bg-white/5 transition-all uppercase">
                ./DISCARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CREATE PANEL (MODAL) ===== */}
      {creatingRound && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-cyan-500/30 p-6 sm:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
               style={{ clipPath: "polygon(3% 0, 100% 0, 100% 95%, 97% 100%, 0 100%, 0 5%)" }}>
            
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <h2 className="text-lg sm:text-xl font-mono font-black text-cyan-500 tracking-widest uppercase">
                {"> ./initialize_new_phase"}<span className="blink text-cyan-500">█</span>
              </h2>
              <button onClick={() => setCreatingRound(null)} className="text-slate-500 hover:text-white transition-colors text-xs font-mono tracking-widest">[ ABORT_ESC ]</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Object.keys(creatingRound).map((field) => (
                <div key={field} className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{field.toUpperCase()}_PARAM</label>
                  <input
                    className="bg-black/50 border border-white/10 p-5 w-full text-white focus:border-cyan-500/50 focus:outline-none transition-all font-mono text-sm"
                    placeholder={`ENTER_${field.toUpperCase()}`}
                    value={creatingRound[field]}
                    onChange={(e) =>
                      setCreatingRound({
                        ...creatingRound,
                        [field]: isNaN(e.target.value) || e.target.value === "" ? e.target.value : Number(e.target.value),
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <button onClick={handleCreate} className="flex-1 py-5 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-black text-sm tracking-[0.3em] hover:bg-cyan-500/40 transition-all uppercase shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                ./GENERATE_PHASE_STRUCTURE
              </button>
              <button onClick={() => setCreatingRound(null)} className="px-10 py-5 border border-white/10 text-slate-500 font-black text-xs tracking-[0.3em] hover:bg-white/5 transition-all uppercase">
                ./ABORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRounds;
