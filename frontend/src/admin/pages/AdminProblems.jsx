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
      console.log(err);
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
        console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl caret">Problem Manager</h1>
        <p className="text-green-500/60 text-xs mt-1">
          manage problems, test cases, and difficulty levels
        </p>
      </div>

      {/* CREATE BUTTON */}
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
        className="mb-6 border border-green-500/30 px-3 py-1 hover:bg-green-500/10 transition text-sm"
      >
        + Create Problem
      </button>

      {/* ===== LIST ===== */}
      <div className="space-y-4">
        {problems.map((p, idx) => (
          <div
            key={p._id}
            className="border border-green-500/20 bg-black/60 p-4 rounded"
          >
            {/* header */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <p className="text-green-300 text-sm sm:text-base">
                {idx + 1}. {p.title}
              </p>

              <span
                className={`text-[10px] px-2 py-[2px] border rounded ${
                  p.difficulty === "easy"
                    ? "border-green-500/40 text-green-400"
                    : p.difficulty === "medium"
                      ? "border-yellow-500/40 text-yellow-400"
                      : "border-red-500/40 text-red-400"
                }`}
              >
                {p.difficulty}
              </span>
            </div>

            {/* meta */}
            <div className="mt-2 text-xs sm:text-sm text-green-500/70 space-y-1">
              <p>Round: {p.round}</p>
              <p>
                {p.description.substring(0, 80)}
                {p.description.length > 80 && "..."}
              </p>
              <p>Test Cases: {p.input?.length || 0}</p>
            </div>

            {/* actions */}
            <div className="mt-3 flex gap-4 text-sm">
              <button
                onClick={() => handleEdit(p)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p.round)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== EDIT PANEL ===== */}
      {editingProblem && (
        <div className="mt-10 border border-yellow-500/30 bg-black/70 p-4 rounded">
          <p className="text-yellow-400 mb-4 text-sm">
            Editing Problem (Round {editingProblem.round})
          </p>

          <div className="space-y-3 text-sm">
            <input
              className="bg-black border border-green-500/30 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
              value={editingProblem.title}
              onChange={(e) =>
                setEditingProblem({ ...editingProblem, title: e.target.value })
              }
              placeholder="Title"
            />

            <textarea
              className="bg-black border border-green-500/30 p-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-green-400"
              value={editingProblem.description}
              onChange={(e) =>
                setEditingProblem({
                  ...editingProblem,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <select
              className="bg-black border border-green-500/30 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
              value={editingProblem.difficulty}
              onChange={(e) =>
                setEditingProblem({
                  ...editingProblem,
                  difficulty: e.target.value,
                })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* TEST CASES */}
            <div className="border border-green-500/20 p-3 mt-4">
              <p className="mb-3 text-green-400/80 text-sm">Test Cases</p>

              {editingProblem.testCases?.map((tc, i) => (
                <div
                  key={i}
                  className="border border-green-500/10 p-2 mb-2 rounded"
                >
                  <p className="text-xs mb-2 text-green-500/70">Case {i + 1}</p>

                  <input
                    className="bg-black border border-green-500/30 p-2 w-full mb-2 focus:outline-none focus:ring-1 focus:ring-green-400"
                    value={tc.input}
                    onChange={(e) => {
                      const updated = [...editingProblem.testCases];
                      updated[i].input = e.target.value;
                      setEditingProblem({
                        ...editingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="Input"
                  />

                  <input
                    className="bg-black border border-green-500/30 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
                    value={tc.expectedOutput}
                    onChange={(e) => {
                      const updated = [...editingProblem.testCases];
                      updated[i].expectedOutput = e.target.value;
                      setEditingProblem({
                        ...editingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="Expected Output"
                  />

                  <button
                    onClick={() => {
                      const updated = editingProblem.testCases.filter(
                        (_, idx) => idx !== i,
                      );
                      setEditingProblem({
                        ...editingProblem,
                        testCases: updated,
                      });
                    }}
                    className="mt-2 text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  const updated = [
                    ...editingProblem.testCases,
                    { input: "", expectedOutput: "" },
                  ];
                  setEditingProblem({ ...editingProblem, testCases: updated });
                }}
                className="mt-2 text-green-400 hover:text-green-300 text-sm"
              >
                + Add Test Case
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <button
              onClick={handleUpdate}
              className="text-green-400 hover:text-green-300"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditingProblem(null)}
              className="text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== CREATE PANEL ===== */}
      {creatingProblem && (
        <div className="mt-10 border border-green-500/30 bg-black/70 p-4 rounded">
          <p className="mb-4 text-sm">Create New Problem</p>

          <div className="space-y-3 text-sm">
            <input
              className="bg-black border border-green-500/30 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
              type="number"
              step="0.1"
              value={creatingProblem.round}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  round: Number(e.target.value),
                })
              }
              placeholder="Round"
            />

            <input
              className="bg-black border border-green-500/30 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
              value={creatingProblem.title}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  title: e.target.value,
                })
              }
              placeholder="Title"
            />

            <textarea
              className="bg-black border border-green-500/30 p-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-green-400"
              value={creatingProblem.description}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <select
              className="bg-black border border-green-500/30 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
              value={creatingProblem.difficulty}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  difficulty: e.target.value,
                })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* TEST CASES */}
            <div className="border border-green-500/20 p-3 mt-4">
              <p className="mb-3 text-green-400/80 text-sm">Test Cases</p>

              {creatingProblem.testCases?.map((tc, i) => (
                <div
                  key={i}
                  className="border border-green-500/10 p-2 mb-2 rounded"
                >
                  <p className="text-xs mb-2 text-green-500/70">Case {i + 1}</p>

                  <input
                    className="bg-black border border-green-500/30 p-2 w-full mb-2 focus:outline-none focus:ring-1 focus:ring-green-400"
                    value={tc.input}
                    onChange={(e) => {
                      const updated = [...creatingProblem.testCases];
                      updated[i].input = e.target.value;
                      setCreatingProblem({
                        ...creatingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="Input"
                  />

                  <input
                    className="bg-black border border-green-500/30 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
                    value={tc.expectedOutput}
                    onChange={(e) => {
                      const updated = [...creatingProblem.testCases];
                      updated[i].expectedOutput = e.target.value;
                      setCreatingProblem({
                        ...creatingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="Expected Output"
                  />

                  <button
                    onClick={() => {
                      const updated = creatingProblem.testCases.filter(
                        (_, idx) => idx !== i,
                      );
                      setCreatingProblem({
                        ...creatingProblem,
                        testCases: updated,
                      });
                    }}
                    className="mt-2 text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  const updated = [
                    ...creatingProblem.testCases,
                    { input: "", expectedOutput: "" },
                  ];
                  setCreatingProblem({
                    ...creatingProblem,
                    testCases: updated,
                  });
                }}
                className="mt-2 text-green-400 hover:text-green-300 text-sm"
              >
                + Add Test Case
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <button
              onClick={handleCreate}
              className="text-green-400 hover:text-green-300"
            >
              Create
            </button>

            <button
              onClick={() => setCreatingProblem(null)}
              className="text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProblems;
