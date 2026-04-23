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
    <div className="relative min-h-screen bg-black text-green-300 font-mono p-4 sm:p-6 overflow-hidden">
      {/* ===== BACKGROUND FX ===== */}
      <div className="absolute inset-0 bg-green-500/10 blur-3xl opacity-20 pointer-events-none animate-pulse" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.10) 3px)",
        }}
      />

      {/* ===== HEADER ===== */}
      <div className="relative z-10 mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-green-200 drop-shadow-[0_0_12px_rgba(0,255,0,0.6)] animate-[fadeIn_0.6s_ease-out]">
          Round Configuration
        </h1>

        <p className="text-green-400/70 text-xs sm:text-sm mt-2 animate-[fadeIn_1s_ease-out]">
          Manage system rules, scoring logic, and execution limits
        </p>
      </div>

      {/* ===== CREATE BUTTON ===== */}
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
        className="
        mb-6 px-4 py-2 text-sm sm:text-base
        border border-green-400/40
        bg-green-500/5
        hover:bg-green-500/15
        active:scale-[0.98]
        transition-all duration-200
        rounded
        shadow-[0_0_15px_rgba(0,255,0,0.08)]
      "
      >
        + Create New Round
      </button>

      {/* ===== ROUND LIST ===== */}
      <div className="relative z-10 space-y-4">
        {rounds.map((r, idx) => (
          <div
            key={r._id}
            className="
            border border-green-500/20
            bg-black/60
            p-4 sm:p-5
            rounded
            hover:border-green-400/40
            transition-all duration-300
            hover:shadow-[0_0_25px_rgba(0,255,0,0.08)]
            animate-[fadeIn_0.4s_ease-out]
          "
          >
            <div className="flex justify-between items-start gap-4 flex-wrap">
              {/* LEFT INFO */}
              <div className="space-y-1">
                <p className="text-green-200 text-sm sm:text-base font-semibold">
                  {idx + 1}. Round {r.roundNumber} — {r.name}
                </p>

                <div className="text-green-400/80 text-xs sm:text-sm space-y-[2px]">
                  <p>⏱ Time Limit: {r.timeLimit} min</p>
                  <p>💠 Base Score: {r.baseScore}</p>
                  <p>
                    ⚙ Execution:{" "}
                    <span className="text-green-300">
                      {r.executionAllowed
                        ? `${r.maxExecutions} attempts`
                        : "Disabled"}
                    </span>
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
                <button
                  onClick={() => setEditingRound({ ...r })}
                  className="
                  text-yellow-300
                  hover:text-yellow-200
                  transition
                  active:scale-95
                "
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(r._id)}
                  className="
                  text-red-400
                  hover:text-red-300
                  transition
                  active:scale-95
                "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== EDIT PANEL ===== */}
      {editingRound && (
        <div
          className="
        relative z-10 mt-10
        border border-yellow-500/30
        bg-black/80
        p-4 sm:p-5
        rounded
        animate-[fadeIn_0.3s_ease-out]
      "
        >
          <h2 className="text-yellow-200 mb-4 text-sm sm:text-base">
            Editing Round {editingRound.roundNumber}
          </h2>

          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {["name", "timeLimit", "baseScore", "maxExecutions"].map(
              (field) => (
                <input
                  key={field}
                  className="
                bg-black
                border border-green-500/30
                p-2
                rounded
                focus:outline-none
                focus:ring-1
                focus:ring-green-400
                text-green-200
              "
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

          <label className="flex items-center gap-2 mt-4 text-sm text-green-300">
            <input
              type="checkbox"
              checked={editingRound.executionAllowed}
              onChange={(e) =>
                setEditingRound({
                  ...editingRound,
                  executionAllowed: e.target.checked,
                })
              }
            />
            Allow execution attempts
          </label>

          <div className="flex gap-4 mt-5 text-sm">
            <button
              onClick={handleUpdate}
              className="text-green-300 hover:text-green-200 transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditingRound(null)}
              className="text-gray-400 hover:text-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== CREATE PANEL ===== */}
      {creatingRound && (
        <div
          className="
        relative z-10 mt-10
        border border-green-500/30
        bg-black/80
        p-4 sm:p-5
        rounded
        animate-[fadeIn_0.3s_ease-out]
      "
        >
          <h2 className="mb-4 text-green-200 text-sm sm:text-base">
            Create New Round
          </h2>

          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {Object.keys(creatingRound).map((field) => (
              <input
                key={field}
                className="
                bg-black
                border border-green-500/30
                p-2
                rounded
                text-green-200
                focus:outline-none
                focus:ring-1
                focus:ring-green-400
              "
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

          <div className="flex gap-4 mt-5 text-sm">
            <button
              onClick={handleCreate}
              className="text-green-300 hover:text-green-200 transition"
            >
              Create
            </button>

            <button
              onClick={() => setCreatingRound(null)}
              className="text-gray-400 hover:text-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRounds;
