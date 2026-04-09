// @ts-nocheck
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const RoundContext = createContext({});

const ContextProvider = ({ children }) => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // 🔐 Token attach
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🚫 Handle auth fail
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(err);
    },
  );

  // 🧠 STATES
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [problem, setProblem] = useState(null);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const [executionCount, setExecutionCount] = useState(0);

  // 🚀 Fetch rounds from backend
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const res = await api.get("/api/rounds");

        const backendRounds = res.data.map((r, index) => ({
          ...r,
          unlocked: index === 0, // only first unlocked initially
        }));

        setRounds(backendRounds);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRounds();
  }, []);

  // 🔓 Unlock NEXT ROUND (IMPORTANT CHANGE)
  const unlockNextRound = (roundNumber) => {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.roundNumber === roundNumber + 1) {
          return { ...r, unlocked: true };
        }
        return r;
      }),
    );
  };

  // 🎯 Fetch problem for selected round
  const fetchProblem = async (roundNumber) => {
    try {
      const res = await api.get(`/api/problem/${roundNumber}`);
      setProblem(res.data);

      // execution control
      if (roundNumber === 1.1 || roundNumber === 1.2) {
        setExecutionCount(1);
      } else if (roundNumber === 3) {
        setExecutionCount(1);
      } else {
        setExecutionCount(0);
      }

      setCurrentRound(roundNumber);
    } catch (err) {
      console.log(err);
    }
  };

  const value = {
    api,
    rounds,
    setRounds,
    currentRound,
    setCurrentRound,
    problem,
    fetchProblem,
    unlockNextRound,
    code,
    setCode,
    output,
    setOutput,
    executionCount,
    setExecutionCount,
  };

  return (
    <RoundContext.Provider value={value}>{children}</RoundContext.Provider>
  );
};

export { ContextProvider, RoundContext };
