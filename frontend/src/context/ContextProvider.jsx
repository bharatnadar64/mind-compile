// @ts-nocheck
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RoundContext = createContext({});

// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔐 Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🚫 Handle 401 (NO redirect loop)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("participantId");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  },
);

export const ContextProvider = ({ children }) => {
  // ================= STATES =================
  const [rounds, setRounds] = useState([]);
  const [loadingRounds, setLoadingRounds] = useState(true);

  const [currentRound, setCurrentRound] = useState(null);
  const [problem, setProblem] = useState(null);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [executionCount, setExecutionCount] = useState(0);

  // ================= LOAD ROUNDS =================
  const loadRounds = async () => {
    try {
      setLoadingRounds(true);

      const res = await api.get("/api/rounds");

      setRounds(res.data);
    } catch (err) {
      console.log("Error loading rounds:", err);
    } finally {
      setLoadingRounds(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingRounds(false);
      return; // ⛔ prevent 401
    }

    loadRounds();
  }, []);

  // ================= UNLOCK NEXT ROUND =================
  const unlockNextRound = async (roundNumber) => {
    try {
      await api.post("/api/rounds/unlock", { currentRound: roundNumber });
      // Reload rounds to get updated unlocked status
      await loadRounds();
    } catch (err) {
      console.log("Error unlocking next round:", err);
    }
  };

  const getExecutionStorageKey = (roundNumber) => {
    const participantId = localStorage.getItem("participantId") || "guest";
    return `run_remaining_${participantId}_${roundNumber}`;
  };

  const getSavedExecutionCount = (roundNumber, maxExecutions) => {
    const key = getExecutionStorageKey(roundNumber);
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const value = Number(saved);
      if (!Number.isNaN(value)) {
        return Math.min(Math.max(value, 0), maxExecutions);
      }
    }
    return maxExecutions;
  };

  // ================= FETCH PROBLEM =================
  const fetchProblem = async (roundNumber) => {
    try {
      const [problemRes, roundRes] = await Promise.all([
        api.get(`/api/problem/${roundNumber}`),
        api.get(`/api/rounds/number/${roundNumber}`),
      ]);

      const roundConfig = roundRes.data;
      const maxExecutions =
        roundConfig.executionAllowed &&
        Number.isFinite(roundConfig.maxExecutions)
          ? Number(roundConfig.maxExecutions)
          : 0;

      setProblem(problemRes.data);
      setCurrentRound(roundNumber);
      setCode("");
      setOutput("");

      const remainingCount = getSavedExecutionCount(roundNumber, maxExecutions);
      setExecutionCount(remainingCount);
      localStorage.setItem(
        getExecutionStorageKey(roundNumber),
        String(remainingCount),
      );
    } catch (err) {
      console.log("Error fetching problem:", err);
    }
  };

  // ================= REFRESH ROUNDS =================
  const refreshRounds = async () => {
    await loadRounds();
  };

  // ================= CONTEXT VALUE =================
  const value = {
    api,

    rounds,
    setRounds,
    loadingRounds,
    loadRounds,
    refreshRounds,

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
