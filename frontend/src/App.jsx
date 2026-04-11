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

function App() {
  return (
    <>
      <ScrollToTop />
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/code-n-submit" element={<CodenSubmit />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="submissions" element={<Submissions />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
