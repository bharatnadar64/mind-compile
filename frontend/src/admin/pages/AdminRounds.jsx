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
      console.log(err);
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

  if (loading)
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-6">
        <p className="animate-pulse">{"> loading system.rounds ..."}</p>
      </div>
    );

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
      <div className="relative z-10 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-green-300 drop-shadow-[0_0_12px_#00ff00]">
          {"> ROUND CONFIGURATION TERMINAL"}
        </h1>
        <p className="text-green-500/60 text-sm mt-2">
          modify system rules carefully
        </p>
      </div>

      {/* CREATE BUTTON */}
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
        className="mb-6 border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black transition"
      >
        + create.round
      </button>

      {/* ROUND LIST */}
      <div className="relative z-10 space-y-4">
        {rounds.map((r) => (
          <div
            key={r._id}
            className="border border-green-500/30 bg-black/70 p-4 rounded"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-green-300">
                  {"> round."}
                  {r.roundNumber} :: {r.name}
                </p>

                <p className="text-sm text-green-500/70">
                  time_limit = {r.timeLimit} min
                </p>

                <p className="text-sm text-green-500/70">
                  base_score = {r.baseScore}
                </p>

                <p className="text-sm text-green-500/70">
                  execution ={" "}
                  {r.executionAllowed
                    ? `${r.maxExecutions} allowed`
                    : "disabled"}
                </p>
              </div>

              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => setEditingRound({ ...r })}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  [edit]
                </button>

                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  [delete]
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT PANEL */}
      {editingRound && (
        <div className="relative z-10 mt-10 border border-yellow-500/40 bg-black/80 p-5 rounded">
          <h2 className="text-yellow-300 mb-4">
            {"> editing.round."}
            {editingRound.roundNumber}
          </h2>

          <div className="grid md:grid-cols-2 gap-3">
            {["name", "timeLimit", "baseScore", "maxExecutions"].map(
              (field) => (
                <input
                  key={field}
                  className="bg-black border border-green-500/40 p-2"
                  value={editingRound[field]}
                  onChange={(e) =>
                    setEditingRound({
                      ...editingRound,
                      [field]: Number(e.target.value) || e.target.value,
                    })
                  }
                  placeholder={field}
                />
              ),
            )}
          </div>

          <label className="block mt-3 text-sm">
            <input
              type="checkbox"
              checked={editingRound.executionAllowed}
              onChange={(e) =>
                setEditingRound({
                  ...editingRound,
                  executionAllowed: e.target.checked,
                })
              }
            />{" "}
            execution_allowed
          </label>

          <div className="flex gap-4 mt-4">
            <button onClick={handleUpdate} className="text-green-400">
              [save]
            </button>
            <button
              onClick={() => setEditingRound(null)}
              className="text-gray-400"
            >
              [cancel]
            </button>
          </div>
        </div>
      )}

      {/* CREATE PANEL */}
      {creatingRound && (
        <div className="relative z-10 mt-10 border border-green-500/40 bg-black/80 p-5 rounded">
          <h2 className="mb-4 text-green-300">{"> creating.new.round"}</h2>

          <div className="grid md:grid-cols-2 gap-3">
            {Object.keys(creatingRound).map((field) => (
              <input
                key={field}
                className="bg-black border border-green-500/40 p-2"
                placeholder={field}
                value={creatingRound[field]}
                onChange={(e) =>
                  setCreatingRound({
                    ...creatingRound,
                    [field]: isNaN(e.target.value)
                      ? e.target.value
                      : Number(e.target.value),
                  })
                }
              />
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button onClick={handleCreate} className="text-green-400">
              [create]
            </button>
            <button
              onClick={() => setCreatingRound(null)}
              className="text-gray-400"
            >
              [cancel]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRounds;
