// @ts-nocheck
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NavBar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const linkStyle = (path) =>
    `px-3 py-2 transition-all duration-300 ${
      location.pathname === path
        ? "text-green-300 drop-shadow-[0_0_8px_#00ff00]"
        : "text-green-400 hover:text-green-300"
    }`;

  return (
    <nav className="bg-black border-b border-green-500/20 font-mono">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-green-400 text-lg tracking-widest font-bold drop-shadow-[0_0_10px_#00ff00]"
        >
          MINDCOMPILE_
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className={linkStyle("/")}>
            HOME
          </Link>

          <Link to="/rounds" className={linkStyle("/rounds")}>
            ROUNDS
          </Link>

          <Link to="/rules" className={linkStyle("/rules")}>
            RULES
          </Link>

          {/* 🔒 Protected Route */}
          {isLoggedIn && (
            <Link to="/code-n-submit" className={linkStyle("/code-n-submit")}>
              CODE
            </Link>
          )}

          {/* 🔥 Auth Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="
                px-4 py-2 border border-red-500
                text-red-400 hover:bg-red-500 hover:text-black
                transition-all duration-300
                shadow-[0_0_10px_rgba(255,0,0,0.3)]
              "
            >
              LOGOUT
            </button>
          ) : (
            <Link
              to="/login"
              className="
                px-4 py-2 border border-green-400
                text-green-400 hover:bg-green-400 hover:text-black
                transition-all duration-300
                shadow-[0_0_10px_rgba(0,255,0,0.3)]
              "
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
