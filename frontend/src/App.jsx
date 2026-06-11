import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Rules from "./components/Rules";
import Rounds from "./components/Rounds";
import CodenSubmit from "./pages/CodenSubmit";
import Auth from "./pages/Auth";
import UserLeaderboard from "./pages/UserLeaderboard";
import Profile from "./pages/Profile";

import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

import AdminRoute from "./admin/routes/AdminRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Leaderboard from "./admin/pages/Leaderboard";
import Submissions from "./admin/pages/Submissions";
import Users from "./admin/pages/Users";
import AdminRounds from "./admin/pages/AdminRounds";
import AdminProblems from "./admin/pages/AdminProblems";
import AdminNavbar from "./admin/components/AdminNavbar";
import AntiCheatDashboard from "./admin/pages/AntiCheatDashboard";

const SYSTEM_LOGS = [
  "CONNECTING_TO_NODE_77...",
  "ENCRYPTING_PACKETS...",
  "BYPASSING_FIREWALL...",
  "ACCESS_GRANTED_UID_882",
  "UPLOADING_LOGIC_GATE...",
  "DECRYPTING_BUFFER...",
  "STABILIZING_CONNECTION...",
  "THREAT_DETECTED_NULL",
  "HEARTBEAT_STABLE",
  "SYNCHRONIZING_CLOCKS..."
];

function App() {
  const location = useLocation();
  const [currentLog, setCurrentLog] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
      setCurrentLog(randomLog);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.getElementsByClassName("cyber-card");
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Skip anti-tamper for admins
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.role === "admin" || location.pathname.startsWith("/admin")) {
      return;
    }

    const handleKeydown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [location.pathname]);

  // ✅ Safe user parsing
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCodenSubmitPage = location.pathname === "/code-n-submit";
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="relative min-h-screen selection:bg-emerald-500/40 selection:text-emerald-100">
      <ScrollToTop />
      
      {/* Global Scanning Beam */}
      <div className="scanning-beam" />

      {/* Background System Logs Overlay */}
      <div className="fixed top-24 right-6 z-[1] pointer-events-none opacity-20 hidden lg:block">
        <div className="font-mono text-[10px] text-emerald-500 tracking-[0.3em] flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYS_LOG: {currentLog}</span>
          </div>
          <div className="w-48 h-[1px] bg-emerald-500/20" />
        </div>
      </div>

      {/* 🔥 NAVBAR SWITCH — hidden on code-n-submit */}
      {!isCodenSubmitPage && (isAdminRoute ? <AdminNavbar /> : <NavBar />)}

      <main className="relative z-[2]">
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route
            path="/"
            element={user?.isAdmin ? <Navigate to="/admin" replace /> : <Home />}
          />

          <Route path="/about" element={<About />} />
          <Route path="/rules" element={<Rules />} />

          {/* ================= PROTECTED USER ================= */}
          <Route
            path="/rounds"
            element={isLoggedIn ? <Rounds /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/leaderboard"
            element={
              isLoggedIn ? <UserLeaderboard /> : <Navigate to="/login" replace />
            }
          />
          
          <Route
            path="/profile"
            element={
              isLoggedIn ? <Profile /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/code-n-submit"
            element={
              isLoggedIn ? <CodenSubmit /> : <Navigate to="/login" replace />
            }
          />

          {/* ================= AUTH ================= */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                user?.isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/rounds" replace />
                )
              ) : (
                <Auth />
              )
            }
          />

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="users" element={<Users />} />
            <Route path="rounds" element={<AdminRounds />} />
            <Route path="problems" element={<AdminProblems />} />
            <Route path="anticheat" element={<AntiCheatDashboard />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 🔥 Hide footer on admin and code-n-submit */}
      {!isAdminRoute && !isCodenSubmitPage && <Footer />}
    </div>
  );
}

export default App;
