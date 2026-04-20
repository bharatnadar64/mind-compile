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

      // Get unlocked rounds from localStorage
      const unlockedRounds = JSON.parse(
        localStorage.getItem("unlockedRounds") || "[]",
      );

      // If no unlocked, unlock the first
      if (unlockedRounds.length === 0 && res.data.length > 0) {
        unlockedRounds.push(res.data[0].roundNumber);
        localStorage.setItem("unlockedRounds", JSON.stringify(unlockedRounds));
      }

      // ✅ Correct unlock logic (supports 1.1, 1.2)
      const formatted = res.data.map((r) => ({
        ...r,
        unlocked: unlockedRounds.includes(r.roundNumber),
      }));

      setRounds(formatted);
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
  const unlockNextRound = (roundNumber) => {
    setRounds((prev) => {
      const index = prev.findIndex((r) => r.roundNumber === roundNumber);
      if (index === -1) return prev;

      const updated = prev.map((r, i) => {
        if (i === index) return { ...r, unlocked: false }; // lock current
        if (i === index + 1) return { ...r, unlocked: true }; // unlock next
        return r;
      });

      // Update localStorage
      const unlockedRounds = updated
        .filter((r) => r.unlocked)
        .map((r) => r.roundNumber);
      localStorage.setItem("unlockedRounds", JSON.stringify(unlockedRounds));

      return updated;
    });
  };

  // ================= FETCH PROBLEM =================
  const fetchProblem = async (roundNumber) => {
    try {
      const res = await api.get(`/api/problem/${roundNumber}`);

      setProblem(res.data);
      setCurrentRound(roundNumber);

      // 🧪 Execution rules
      if (roundNumber === 1.1 || roundNumber === 1.2 || roundNumber === 3) {
        setExecutionCount(1);
      } else {
        setExecutionCount(0);
      }

      setCode("");
      setOutput("");
    } catch (err) {
      console.log("Error fetching problem:", err);
    }
  };

  // ================= REFRESH ROUNDS =================
  const refreshRounds = async () => {
    try {
      const res = await api.get("/api/rounds");

      const updated = res.data.map((r, index) => ({
        ...r,
        unlocked: index === 0, // ✅ always keep first unlocked
      }));

      setRounds(updated);
    } catch (err) {
      console.log("Error refreshing rounds:", err);
    }
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
