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
    <div className="bg-black text-green-400 min-h-screen p-6 font-mono">
      <h1 className="text-xl mb-6">$ admin.problems --manage</h1>

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
        className="mb-4 hover:text-green-300"
      >
        [create new problem]
      </button>

      {/* LIST */}
      <div className="space-y-4">
        {problems.map((p) => (
          <div key={p._id} className="border border-green-500 p-4">
            <p>{`> Round ${p.round} : ${p.title}`}</p>
            <p>{`  difficulty = ${p.difficulty}`}</p>
            <p>{`  description = ${p.description.substring(0, 50)}...`}</p>
            <p>{`  test_cases = ${p.input?.length || 0}`}</p>

            <div className="mt-2 flex gap-4">
              <button
                onClick={() => handleEdit(p)}
                className="hover:text-yellow-400"
              >
                [edit]
              </button>

              <button
                onClick={() => handleDelete(p.round)}
                className="hover:text-red-500"
              >
                [delete]
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT PANEL */}
      {editingProblem && (
        <div className="mt-8 border border-green-500 p-4">
          <p className="mb-4">{`$ editing problem for round ${editingProblem.round}`}</p>

          <div className="space-y-3">
            <input
              className="bg-black border border-green-500 p-2 w-full"
              value={editingProblem.title}
              onChange={(e) =>
                setEditingProblem({ ...editingProblem, title: e.target.value })
              }
              placeholder="title"
            />

            <textarea
              className="bg-black border border-green-500 p-2 w-full h-20"
              value={editingProblem.description}
              onChange={(e) =>
                setEditingProblem({
                  ...editingProblem,
                  description: e.target.value,
                })
              }
              placeholder="description"
            />

            <select
              className="bg-black border border-green-500 p-2 w-full"
              value={editingProblem.difficulty}
              onChange={(e) =>
                setEditingProblem({
                  ...editingProblem,
                  difficulty: e.target.value,
                })
              }
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>

            {/* TEST CASES */}
            <div className="border border-green-500/50 p-3 mt-4">
              <p className="mb-3">Test Cases:</p>
              {editingProblem.testCases?.map((tc, i) => (
                <div key={i} className="border border-green-500/30 p-2 mb-2">
                  <p className="text-sm mb-2">Case {i + 1}</p>
                  <input
                    className="bg-black border border-green-500 p-2 w-full mb-2"
                    value={tc.input}
                    onChange={(e) => {
                      const updated = [...editingProblem.testCases];
                      updated[i].input = e.target.value;
                      setEditingProblem({
                        ...editingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="input"
                  />
                  <input
                    className="bg-black border border-green-500 p-2 w-full"
                    value={tc.expectedOutput}
                    onChange={(e) => {
                      const updated = [...editingProblem.testCases];
                      updated[i].expectedOutput = e.target.value;
                      setEditingProblem({
                        ...editingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="expected output"
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
                    className="mt-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    [remove case]
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
                [add test case]
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={handleUpdate} className="hover:text-green-300">
              [save]
            </button>

            <button
              onClick={() => setEditingProblem(null)}
              className="hover:text-gray-400"
            >
              [cancel]
            </button>
          </div>
        </div>
      )}

      {/* CREATE PANEL */}
      {creatingProblem && (
        <div className="mt-8 border border-green-500 p-4">
          <p className="mb-4">$ creating new problem</p>

          <div className="space-y-3">
            <input
              className="bg-black border border-green-500 p-2 w-full"
              type="number"
              step="0.1"
              value={creatingProblem.round}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  round: Number(e.target.value),
                })
              }
              placeholder="round number (e.g. 1.1)"
            />

            <input
              className="bg-black border border-green-500 p-2 w-full"
              value={creatingProblem.title}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  title: e.target.value,
                })
              }
              placeholder="title"
            />

            <textarea
              className="bg-black border border-green-500 p-2 w-full h-20"
              value={creatingProblem.description}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  description: e.target.value,
                })
              }
              placeholder="description"
            />

            <select
              className="bg-black border border-green-500 p-2 w-full"
              value={creatingProblem.difficulty}
              onChange={(e) =>
                setCreatingProblem({
                  ...creatingProblem,
                  difficulty: e.target.value,
                })
              }
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>

            {/* TEST CASES */}
            <div className="border border-green-500/50 p-3 mt-4">
              <p className="mb-3">Test Cases:</p>
              {creatingProblem.testCases?.map((tc, i) => (
                <div key={i} className="border border-green-500/30 p-2 mb-2">
                  <p className="text-sm mb-2">Case {i + 1}</p>
                  <input
                    className="bg-black border border-green-500 p-2 w-full mb-2"
                    value={tc.input}
                    onChange={(e) => {
                      const updated = [...creatingProblem.testCases];
                      updated[i].input = e.target.value;
                      setCreatingProblem({
                        ...creatingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="input"
                  />
                  <input
                    className="bg-black border border-green-500 p-2 w-full"
                    value={tc.expectedOutput}
                    onChange={(e) => {
                      const updated = [...creatingProblem.testCases];
                      updated[i].expectedOutput = e.target.value;
                      setCreatingProblem({
                        ...creatingProblem,
                        testCases: updated,
                      });
                    }}
                    placeholder="expected output"
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
                    className="mt-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    [remove case]
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
                [add test case]
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={handleCreate} className="hover:text-green-300">
              [create]
            </button>

            <button
              onClick={() => setCreatingProblem(null)}
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

export default AdminProblems;
