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

  const handleEdit = (round) => {
    setEditingRound({ ...round });
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
      <div className="bg-black text-green-400 min-h-screen p-6 font-mono">
        <p>$ loading rounds...</p>
      </div>
    );

  return (
    <div className="bg-black text-green-400 min-h-screen p-6 font-mono">
      <h1 className="text-xl mb-6">$ admin.rounds --manage</h1>

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
        className="mb-4 hover:text-green-300"
      >
        [create new round]
      </button>

      {/* LIST */}
      <div className="space-y-4">
        {rounds.map((r) => (
          <div key={r._id} className="border border-green-500 p-4">
            <p>{`> Round ${r.roundNumber} : ${r.name}`}</p>
            <p>{`  time_limit = ${r.timeLimit} min`}</p>
            <p>{`  base_score = ${r.baseScore}`}</p>
            <p>
              {`  execution = ${
                r.executionAllowed ? `${r.maxExecutions} allowed` : "disabled"
              }`}
            </p>

            <div className="mt-2 flex gap-4">
              <button
                onClick={() => handleEdit(r)}
                className="hover:text-yellow-400"
              >
                [edit]
              </button>

              <button
                onClick={() => handleDelete(r._id)}
                className="hover:text-red-500"
              >
                [delete]
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT PANEL */}
      {editingRound && (
        <div className="mt-8 border border-green-500 p-4">
          <p className="mb-4">{`$ editing round ${editingRound.roundNumber}`}</p>

          <div className="space-y-3">
            <input
              className="bg-black border border-green-500 p-2 w-full"
              value={editingRound.name}
              onChange={(e) =>
                setEditingRound({ ...editingRound, name: e.target.value })
              }
              placeholder="name"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={editingRound.timeLimit}
              onChange={(e) =>
                setEditingRound({
                  ...editingRound,
                  timeLimit: Number(e.target.value),
                })
              }
              placeholder="time limit"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={editingRound.baseScore}
              onChange={(e) =>
                setEditingRound({
                  ...editingRound,
                  baseScore: Number(e.target.value),
                })
              }
              placeholder="base score"
            />

            <label>
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

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={editingRound.maxExecutions}
              onChange={(e) =>
                setEditingRound({
                  ...editingRound,
                  maxExecutions: Number(e.target.value),
                })
              }
              placeholder="max executions"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={handleUpdate} className="hover:text-green-300">
              [save]
            </button>

            <button
              onClick={() => setEditingRound(null)}
              className="hover:text-gray-400"
            >
              [cancel]
            </button>
          </div>
        </div>
      )}

      {/* CREATE PANEL */}
      {creatingRound && (
        <div className="mt-8 border border-green-500 p-4">
          <p className="mb-4">$ creating new round</p>

          <div className="space-y-3">
            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              step="0.1"
              value={creatingRound.roundNumber}
              onChange={(e) =>
                setCreatingRound({
                  ...creatingRound,
                  roundNumber: Number(e.target.value),
                })
              }
              placeholder="round number (e.g. 2)"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              value={creatingRound.name}
              onChange={(e) =>
                setCreatingRound({ ...creatingRound, name: e.target.value })
              }
              placeholder="name"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={creatingRound.timeLimit}
              onChange={(e) =>
                setCreatingRound({
                  ...creatingRound,
                  timeLimit: Number(e.target.value),
                })
              }
              placeholder="time limit"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={creatingRound.baseScore}
              onChange={(e) =>
                setCreatingRound({
                  ...creatingRound,
                  baseScore: Number(e.target.value),
                })
              }
              placeholder="base score"
            />

            <label>
              <input
                type="checkbox"
                checked={creatingRound.executionAllowed}
                onChange={(e) =>
                  setCreatingRound({
                    ...creatingRound,
                    executionAllowed: e.target.checked,
                  })
                }
              />{" "}
              execution_allowed
            </label>

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={creatingRound.maxExecutions}
              onChange={(e) =>
                setCreatingRound({
                  ...creatingRound,
                  maxExecutions: Number(e.target.value),
                })
              }
              placeholder="max executions"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={creatingRound.bonusFirst}
              onChange={(e) =>
                setCreatingRound({
                  ...creatingRound,
                  bonusFirst: Number(e.target.value),
                })
              }
              placeholder="bonus first"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              value={creatingRound.bonusCleanCode}
              onChange={(e) =>
                setCreatingRound({
                  ...creatingRound,
                  bonusCleanCode: Number(e.target.value),
                })
              }
              placeholder="bonus clean code"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={handleCreate} className="hover:text-green-300">
              [create]
            </button>

            <button
              onClick={() => setCreatingRound(null)}
              className="hover:text-gray-400"
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
