// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { RoundContext } from "../../context/ContextProvider";

const AdminProblems = () => {
  const { api } = useContext(RoundContext);

  const [problems, setProblems] = useState([]);
  const [editingProblem, setEditingProblem] = useState(null);
  const [creatingProblem, setCreatingProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/problem");
      setProblems(res.data);
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (round) => {
    if (confirm(`Delete problem for round ${round}?`)) {
      try {
        await api.delete(`/api/problem/${round}`);
        fetchProblems();
      } catch (err) {

      }
    }
  };

  const handleEdit = (problem) => {
    const testCases = (problem.input || []).map((input, i) => ({
      input,
      expectedOutput: problem.expectedOutput?.[i] || "",
    }));

    setEditingProblem({
      ...problem,
      testCases:
        testCases.length > 0 ? testCases : [{ input: "", expectedOutput: "" }],
    });
  };

  const handleUpdate = async () => {
    try {
      const updated = {
        ...editingProblem,
        input: editingProblem.testCases
          .map((tc) => tc.input)
          .filter((i) => i.trim()),
        expectedOutput: editingProblem.testCases
          .map((tc) => tc.expectedOutput)
          .filter((i) => i.trim()),
      };
      delete updated.testCases;
      await api.put(`/api/problem/${editingProblem.round}`, updated);
      setEditingProblem(null);
      fetchProblems();
    } catch (err) {

    }
  };

  const handleCreate = async () => {
    try {
      const newProblem = {
        ...creatingProblem,
        input: creatingProblem.testCases
          .map((tc) => tc.input)
          .filter((i) => i.trim()),
        expectedOutput: creatingProblem.testCases
          .map((tc) => tc.expectedOutput)
          .filter((i) => i.trim()),
      };
      delete newProblem.testCases;
      await api.post("/api/problem", newProblem);
      setCreatingProblem(null);
      fetchProblems();
    } catch (err) {

    }
  };

  if (loading)
    return (
      <div className="bg-black text-green-400 min-h-screen p-6 font-mono">
        <p>$ loading problems...</p>
      </div>
    );

  return (
    <div className="relative bg-black text-green-400 min-h-screen p-4 sm:p-6 font-mono overflow-hidden">
      {/* ===== SUBTLE FX ===== */}
      <style>{`
      @keyframes caret { 50% { opacity: 0; } }
      .caret::after {
        content: "_";
        animation: caret 1s step-end infinite;
      }
    `}</style>

      {/* soft grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(#22c55e_1px,transparent_1px),linear-gradient(90deg,#22c55e_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-green-500/10 pb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-white glitch" data-text="PROBLEM_ENGINE_V1.0">
            PROBLEM_ENGINE_V1.0
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-widest">CENTRAL_LOGIC_REPOSITORY</p>
        </div>

        <button
          onClick={() =>
            setCreatingProblem({
              title: "",
              description: "",
              difficulty: "easy",
              round: "",
              testCases: [{ input: "", expectedOutput: "" }],
            })
          }
          className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-black text-xs tracking-[0.2em] hover:bg-emerald-500/20 transition-all active:scale-95"
          style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
        >
          [+] INITIALIZE_NEW_PARAMETER
        </button>
      </div>

      {/* ===== LIST ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {problems.map((p, idx) => (
          <div
            key={p._id}
            className="group relative p-6 md:p-8 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-500"
            style={{ clipPath: "polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)" }}
          >
            {/* Index indicator */}
            <div className="absolute top-0 right-0 p-4 font-mono text-4xl font-black text-white/[0.03] group-hover:text-emerald-500/[0.05] transition-colors">
              {(idx + 1).toString().padStart(2, '0')}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                  {p.title}
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" /> ROUND_0{p.round}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blue-500" /> CASES_{p.input?.length || 0}
                  </span>
                </div>
              </div>

              <span
                className={`text-[9px] font-black px-2 py-0.5 border rounded-sm tracking-[0.2em] uppercase ${
                  p.difficulty === "easy"
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
                    : p.difficulty === "medium"
                      ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/5"
                      : "border-rose-500/40 text-rose-400 bg-rose-500/5"
                }`}
              >
                {p.difficulty}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-mono leading-relaxed mb-8 line-clamp-2">
              {p.description}
            </p>

            {/* actions */}
            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <div className="flex gap-6">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-[10px] font-black text-emerald-500/60 hover:text-emerald-400 uppercase tracking-widest transition-colors"
                >
                  [ EDIT_LOGIC ]
                </button>
                <button
                  onClick={() => handleDelete(p.round)}
                  className="text-[10px] font-black text-rose-500/60 hover:text-rose-400 uppercase tracking-widest transition-colors"
                >
                  [ PURGE ]
                </button>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(b => (
                  <div key={b} className={`w-1 h-1 rounded-full ${b <= (p.difficulty === "easy" ? 1 : p.difficulty === "medium" ? 2 : 3) ? "bg-emerald-500" : "bg-white/10"}`} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== EDIT PANEL ===== */}
      {editingProblem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-emerald-500/30 p-6 md:p-8 overflow-y-auto max-h-[90vh]"
               style={{ clipPath: "polygon(0 0, 97% 0, 100% 3%, 100% 100%, 3% 100%, 0 97%)" }}>
            
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-emerald-400 tracking-widest uppercase">
                {">"} EDIT_PARAMETER_SET :: ROUND_0{editingProblem.round}
              </h2>
              <button onClick={() => setEditingProblem(null)} className="text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">[ ESC ]</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">PARAMETER_TITLE</label>
                  <input
                    className="bg-black/50 border border-white/10 p-4 w-full text-white focus:border-emerald-500/50 focus:outline-none transition-all font-mono"
                    value={editingProblem.title}
                    onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">LOGIC_DESCRIPTION</label>
                  <textarea
                    className="bg-black/50 border border-white/10 p-4 w-full h-40 text-white focus:border-emerald-500/50 focus:outline-none transition-all font-mono text-sm leading-relaxed"
                    value={editingProblem.description}
                    onChange={(e) => setEditingProblem({ ...editingProblem, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">THREAT_LEVEL</label>
                  <select
                    className="bg-black/50 border border-white/10 p-4 w-full text-white focus:border-emerald-500/50 focus:outline-none transition-all font-mono uppercase tracking-widest"
                    value={editingProblem.difficulty}
                    onChange={(e) => setEditingProblem({ ...editingProblem, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">TEST_VECTOR_MODALITIES</label>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {editingProblem.testCases?.map((tc, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 relative group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-tighter">VECTOR_{i.toString().padStart(2, '0')}</span>
                        <button onClick={() => {
                          const updated = editingProblem.testCases.filter((_, idx) => idx !== i);
                          setEditingProblem({ ...editingProblem, testCases: updated });
                        }} className="text-rose-500/40 hover:text-rose-500 transition-colors text-[9px] font-black uppercase tracking-widest">[ DELETE ]</button>
                      </div>
                      <input
                        className="bg-black/40 border border-white/5 p-2 w-full mb-2 text-xs font-mono focus:border-emerald-500/30 outline-none"
                        value={tc.input}
                        onChange={(e) => {
                          const updated = [...editingProblem.testCases];
                          updated[i].input = e.target.value;
                          setEditingProblem({ ...editingProblem, testCases: updated });
                        }}
                        placeholder="INPUT_STREAM"
                      />
                      <input
                        className="bg-black/40 border border-white/5 p-2 w-full text-xs font-mono focus:border-emerald-500/30 outline-none"
                        value={tc.expectedOutput}
                        onChange={(e) => {
                          const updated = [...editingProblem.testCases];
                          updated[i].expectedOutput = e.target.value;
                          setEditingProblem({ ...editingProblem, testCases: updated });
                        }}
                        placeholder="EXPECTED_OUTPUT"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = [...editingProblem.testCases, { input: "", expectedOutput: "" }];
                      setEditingProblem({ ...editingProblem, testCases: updated });
                    }}
                    className="w-full py-3 border border-dashed border-white/10 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    [+] ADD_TEST_VECTOR
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button onClick={handleUpdate} className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-black text-xs tracking-[0.3em] hover:bg-emerald-500/20 transition-all uppercase">
                COMMIT_CHANGES_TO_DATABASE
              </button>
              <button onClick={() => setEditingProblem(null)} className="px-8 py-4 border border-white/10 text-slate-500 font-black text-xs tracking-[0.3em] hover:bg-white/5 transition-all uppercase">
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CREATE PANEL ===== */}
      {creatingProblem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-blue-500/30 p-6 md:p-8 overflow-y-auto max-h-[90vh]"
               style={{ clipPath: "polygon(0 3%, 3% 0, 100% 0, 100% 97%, 97% 100%, 0 100%)" }}>
            
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-blue-400 tracking-widest uppercase">
                {">"} INITIALIZE_NEW_PARAMETER
              </h2>
              <button onClick={() => setCreatingProblem(null)} className="text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">[ ESC ]</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">ASSIGN_ROUND_ID</label>
                  <input
                    className="bg-black/50 border border-white/10 p-4 w-full text-white focus:border-blue-500/50 focus:outline-none transition-all font-mono"
                    type="number"
                    step="0.1"
                    value={creatingProblem.round}
                    onChange={(e) => setCreatingProblem({ ...creatingProblem, round: Number(e.target.value) })}
                    placeholder="ROUND_ID"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">PARAMETER_TITLE</label>
                  <input
                    className="bg-black/50 border border-white/10 p-4 w-full text-white focus:border-blue-500/50 focus:outline-none transition-all font-mono"
                    value={creatingProblem.title}
                    onChange={(e) => setCreatingProblem({ ...creatingProblem, title: e.target.value })}
                    placeholder="TITLE"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">LOGIC_DESCRIPTION</label>
                  <textarea
                    className="bg-black/50 border border-white/10 p-4 w-full h-40 text-white focus:border-blue-500/50 focus:outline-none transition-all font-mono text-sm leading-relaxed"
                    value={creatingProblem.description}
                    onChange={(e) => setCreatingProblem({ ...creatingProblem, description: e.target.value })}
                    placeholder="DESCRIPTION"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">THREAT_LEVEL</label>
                  <select
                    className="bg-black/50 border border-white/10 p-4 w-full text-white focus:border-blue-500/50 focus:outline-none transition-all font-mono uppercase tracking-widest"
                    value={creatingProblem.difficulty}
                    onChange={(e) => setCreatingProblem({ ...creatingProblem, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">TEST_VECTOR_MODALITIES</label>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {creatingProblem.testCases?.map((tc, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 relative group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono text-blue-500/60 uppercase tracking-tighter">VECTOR_{i.toString().padStart(2, '0')}</span>
                        <button onClick={() => {
                          const updated = creatingProblem.testCases.filter((_, idx) => idx !== i);
                          setCreatingProblem({ ...creatingProblem, testCases: updated });
                        }} className="text-rose-500/40 hover:text-rose-500 transition-colors text-[9px] font-black uppercase tracking-widest">[ DELETE ]</button>
                      </div>
                      <input
                        className="bg-black/40 border border-white/5 p-2 w-full mb-2 text-xs font-mono focus:border-blue-500/30 outline-none"
                        value={tc.input}
                        onChange={(e) => {
                          const updated = [...creatingProblem.testCases];
                          updated[i].input = e.target.value;
                          setCreatingProblem({ ...creatingProblem, testCases: updated });
                        }}
                        placeholder="INPUT_STREAM"
                      />
                      <input
                        className="bg-black/40 border border-white/5 p-2 w-full text-xs font-mono focus:border-blue-500/30 outline-none"
                        value={tc.expectedOutput}
                        onChange={(e) => {
                          const updated = [...creatingProblem.testCases];
                          updated[i].expectedOutput = e.target.value;
                          setCreatingProblem({ ...creatingProblem, testCases: updated });
                        }}
                        placeholder="EXPECTED_OUTPUT"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = [...creatingProblem.testCases, { input: "", expectedOutput: "" }];
                      setCreatingProblem({ ...creatingProblem, testCases: updated });
                    }}
                    className="w-full py-3 border border-dashed border-white/10 text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    [+] ADD_TEST_VECTOR
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button onClick={handleCreate} className="flex-1 py-4 bg-blue-500/10 border border-blue-500/50 text-blue-400 font-black text-xs tracking-[0.3em] hover:bg-blue-500/20 transition-all uppercase">
                PUSH_PARAMETER_TO_CENTRAL_ARRAY
              </button>
              <button onClick={() => setCreatingProblem(null)} className="px-8 py-4 border border-white/10 text-slate-500 font-black text-xs tracking-[0.3em] hover:bg-white/5 transition-all uppercase">
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProblems;
