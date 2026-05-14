import { useEffect } from "react";
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

function App() {
  const location = useLocation();
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
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      <ScrollToTop />

      {/* 🔥 NAVBAR SWITCH */}
      {isAdminRoute ? <AdminNavbar /> : <NavBar />}

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

      {/* 🔥 Hide footer on admin */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
