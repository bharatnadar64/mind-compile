// @ts-nocheck
import React, { createContext, useState } from "react";

const RoundContext = createContext({});

const ContextProvider = ({ children }) => {
  const [roundAccess, setRoundAccess] = useState({
    round11: false,
    round12: false,
    round2: true,
    round3: false,
  });

  const [currentRound, setCurrentRound] = useState(roundAccess["round1"]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const rounds = [
    {
      id: 1,
      name: "Round 1.1",
      description: "Warm-Up – Simple Problems",
      access: roundAccess.round11,
    },
    {
      id: 2,
      name: "Round 1.2",
      description: "Warm-Up – Simple Problems",
      access: roundAccess.round12,
    },
    {
      id: 3,
      name: "Round 2",
      description: roundAccess["round2"]
        ? "Core Problem – Medium Difficulty"
        : "Locked",
      access: roundAccess.round2,
    },
    {
      id: 4,
      name: "Round 3",
      description: roundAccess["round3"]
        ? "Final Challenge – Hard Problem"
        : "Locked",
      access: roundAccess.round3,
    },
  ];

  const exampleProblem = {
    id: 1,
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    description: `Write a function that takes two integers and returns their sum. 
You should handle negative numbers as well.

Input:
Two integers a and b separated by a space.

Output:
A single integer representing the sum of a and b.

Constraints:
-1000 <= a, b <= 1000`,
    sampleInput: `3 5`,
    sampleOutput: `8`,
    tags: ["math", "addition", "beginner"],
    timeLimit: "1s",
    memoryLimit: "256MB",
  };

  const [executionCount, setExecutionCount] = useState(2);

  const v = {
    roundAccess,
    setRoundAccess,
    rounds,
    currentRound,
    setCurrentRound,
    output,
    setOutput,
    code,
    setCode,
    exampleProblem,
    executionCount,
    setExecutionCount,
  };
  return <RoundContext.Provider value={v}>{children}</RoundContext.Provider>;
};

export { ContextProvider, RoundContext };
