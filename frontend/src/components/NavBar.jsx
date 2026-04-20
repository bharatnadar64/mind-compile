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
    `relative px-3 py-2 transition-all duration-300 ${
      location.pathname === path
        ? "text-green-300 drop-shadow-[0_0_10px_#00ff00]"
        : "text-green-400 hover:text-green-300"
    }`;

  return (
    <nav className="relative bg-black border-b border-green-500/20 font-mono overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-green-500/5 blur-xl opacity-20 animate-pulse pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-green-400 text-lg tracking-widest font-bold drop-shadow-[0_0_12px_#00ff00] animate-flicker"
        >
          {"> MINDCOMPILE_"}
        </Link>

        {/* Links */}
        <div className="flex items-center gap-5">
          {[
            { to: "/", label: "HOME" },
            { to: "/rounds", label: "ROUNDS" },
            { to: "/leaderboard", label: "LEADERBOARD" },
            { to: "/rules", label: "RULES" },
          ].map((item) => (
            <Link key={item.to} to={item.to} className={linkStyle(item.to)}>
              <span className="mr-1">{">"}</span>
              {item.label}

              {/* hover glitch */}
              <span className="absolute left-0 top-0 opacity-0 hover:opacity-30 text-green-300 blur-[1px] translate-x-[1px]">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Protected */}
          {isLoggedIn && (
            <Link to="/code-n-submit" className={linkStyle("/code-n-submit")}>
              <span className="mr-1">{">"}</span>
              CODE
            </Link>
          )}

          {/* Auth */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="
                relative px-4 py-2 border border-red-500
                text-red-400 hover:bg-red-500 hover:text-black
                transition-all duration-300
                shadow-[0_0_12px_rgba(255,0,0,0.4)]
                overflow-hidden
              "
            >
              LOGOUT
              {/* subtle glitch */}
              <span className="absolute inset-0 opacity-0 hover:opacity-30 bg-red-400 blur-sm"></span>
            </button>
          ) : (
            <Link
              to="/login"
              className="
                relative px-4 py-2 border border-green-400
                text-green-400 hover:bg-green-400 hover:text-black
                transition-all duration-300
                shadow-[0_0_12px_rgba(0,255,0,0.4)]
                overflow-hidden
              "
            >
              LOGIN
              <span className="absolute inset-0 opacity-0 hover:opacity-30 bg-green-300 blur-sm"></span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 4s linear infinite" }}
        />
      </div>

      {/* Status strip (this is the killer detail) */}
      <div className="text-[10px] sm:text-xs text-green-500/60 px-4 py-1 border-t border-green-500/10 flex justify-between">
        <span>{"> user.status: " + (isLoggedIn ? "AUTHORIZED" : "GUEST")}</span>
        <span className="animate-flicker">{"> system.latency: 12ms"}</span>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes scanMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }

          @keyframes flicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; }
            20%, 24%, 55% { opacity: 0.3; }
          }

          .animate-flicker {
            animation: flicker 2.5s infinite;
          }
        `}
      </style>
    </nav>
  );
};

export default NavBar;
