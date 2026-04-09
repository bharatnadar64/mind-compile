// @ts-nocheck
import React, { useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const Rounds = () => {
  const { rounds, fetchProblem } = useContext(RoundContext);
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-black text-green-400 font-mono p-10">
      <h1 className="text-4xl text-center mb-10">MindCompile Rounds</h1>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {rounds.map((round) => (
          <div
            key={round._id}
            className={`border p-6 ${
              round.unlocked ? "border-green-400" : "opacity-40"
            }`}
          >
            <h2 className="text-2xl">{round.name}</h2>
            <p className="text-green-500">{round.timeLimit} mins</p>

            <button
              disabled={!round.unlocked}
              onClick={() => {
                fetchProblem(round.roundNumber);
                navigate("/code-n-submit");
              }}
              className="mt-4 px-4 py-2 border border-green-400 hover:bg-green-400 hover:text-black"
            >
              {round.unlocked ? "Enter" : "Locked"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Rounds;
