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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
