// @ts-nocheck
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const RoundContext = createContext({});

const ContextProvider = ({ children }) => {
  // 🌐 AXIOS INSTANCE
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // 🔐 Attach token
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
        localStorage.removeItem("participantId");
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

  // 🆔 USER KEY
  const getStorageKey = () => {
    const userId = localStorage.getItem("participantId");
    return userId ? `rounds_${userId}` : "rounds_guest";
  };

  // =========================================
  // 🚀 INIT ROUNDS (USER-SPECIFIC)
  // =========================================
  useEffect(() => {
    const initRounds = async () => {
      try {
        const key = getStorageKey();
        const saved = localStorage.getItem(key);

        if (saved) {
          setRounds(JSON.parse(saved));
        } else {
          const res = await api.get("/api/rounds");

          const backendRounds = res.data.map((r, index) => ({
            ...r,
            unlocked: index === 0, // only first unlocked
          }));

          setRounds(backendRounds);
          localStorage.setItem(key, JSON.stringify(backendRounds));
        }
      } catch (err) {
        console.log("Error loading rounds:", err);
      }
    };

    initRounds();
  }, []);

  // =========================================
  // 💾 AUTO SAVE (USER-SPECIFIC)
  // =========================================
  useEffect(() => {
    if (rounds.length > 0) {
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(rounds));
    }
  }, [rounds]);

  // =========================================
  // 🔓 UNLOCK NEXT ROUND (LOCK CURRENT)
  // =========================================
  const unlockNextRound = (roundNumber) => {
    setRounds((prev) => {
      const index = prev.findIndex((r) => r.roundNumber === roundNumber);
      if (index === -1) return prev;

      return prev.map((r, i) => {
        if (i === index) return { ...r, unlocked: false }; // 🔒 lock current
        if (i === index + 1) return { ...r, unlocked: true }; // 🔓 unlock next
        return r;
      });
    });
  };

  // =========================================
  // 🎯 FETCH PROBLEM
  // =========================================
  const fetchProblem = async (roundNumber) => {
    try {
      const res = await api.get(`/api/problem/${roundNumber}`);

      setProblem(res.data);
      setCurrentRound(roundNumber);

      // 🧪 Execution control
      if (roundNumber === 1.1 || roundNumber === 1.2) {
        setExecutionCount(1);
      } else if (roundNumber === 3) {
        setExecutionCount(1);
      } else {
        setExecutionCount(0);
      }

      // 🧹 Reset editor
      setCode("");
      setOutput("");
    } catch (err) {
      console.log("Error fetching problem:", err);
    }
  };

  // =========================================
  // 📦 CONTEXT VALUE
  // =========================================
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
