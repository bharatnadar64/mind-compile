// @ts-nocheck
import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Rules from "./components/Rules";
import Rounds from "./components/Rounds";
import CodenSubmit from "./pages/CodenSubmit";
import Auth from "./pages/Auth";
import AdminRoute from "./admin/routes/AdminRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Leaderboard from "./admin/pages/Leaderboard";
import Submissions from "./admin/pages/Submissions";
import { useLocation } from "react-router-dom";
import AdminNavbar from "./admin/components/AdminNavbar";
import Users from "./admin/pages/Users";
import { Navigate } from "react-router-dom";

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {/* 🔥 CONDITIONAL NAVBAR */}
      {isAdminRoute ? <AdminNavbar /> : <NavBar />}

      <Routes>
        <Route
          path="/"
          element={(() => {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?.isAdmin ? <Navigate to="/admin" /> : <Home />;
          })()}
        />
        <Route path="/about" element={<About />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/code-n-submit" element={<CodenSubmit />} />
        <Route path="/login" element={<Auth />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}
export default App;
