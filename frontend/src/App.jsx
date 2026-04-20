// @ts-nocheck
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Rules from "./components/Rules";
import Rounds from "./components/Rounds";
import CodenSubmit from "./pages/CodenSubmit";
import Auth from "./pages/Auth";

import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

import AdminRoute from "./admin/routes/AdminRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Leaderboard from "./admin/pages/Leaderboard";
import Submissions from "./admin/pages/Submissions";
import Users from "./admin/pages/Users";
import AdminRounds from "./admin/pages/AdminRounds";
import AdminNavbar from "./admin/components/AdminNavbar";

function App() {
  const location = useLocation();

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
