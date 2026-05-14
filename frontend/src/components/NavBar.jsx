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

  return (
    <nav className="bg-slate-950 border-b terminal-border font-mono overflow-hidden sticky top-0 z-50 scene-3d">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/8 via-transparent to-cyan-900/5 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-3 pointer-events-none" />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,0,0.08),transparent_60%)] pointer-events-none" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="
          text-green-300
          font-bold
          tracking-[0.35em]
          text-lg sm:text-2xl
          glow-text
          hover:text-cyan-300 transition-all duration-300
          flex items-center gap-2
        "
        >
          <span className="text-cyan-400">⚡</span>
          MINDCOMPILE
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: "/", label: "HOME" },
            { to: "/rounds", label: "ROUNDS" },
            { to: "/leaderboard", label: "RANKS" },
            { to: "/rules", label: "RULES" },
            { to: "/profile", label: "PROFILE" },
          ].map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  relative group
                  text-sm tracking-[0.2em] font-mono font-bold
                  transition-all duration-300
                  ${isActive
                    ? "text-green-300 glow-text"
                    : "text-green-400/70 hover:text-green-200"
                  }
                `}
              >
                <span className="text-cyan-400 mr-1">
                  {isActive ? "●" : "○"}
                </span>
                {item.label}

                {/* Underline animation */}
                <span
                  className={`
                    absolute left-0 -bottom-2 h-[2px]
                    bg-gradient-to-r from-green-400 to-cyan-400
                    transition-all duration-300
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </Link>
            );
          })}

          {/* Code submission link */}
          {isLoggedIn && (
            <Link
              to="/code-n-submit"
              className="
                relative group
                text-sm tracking-[0.2em] font-mono font-bold
                text-cyan-400 hover:text-cyan-300
                transition-all duration-300
                border-l border-cyan-500/30 pl-4
              "
            >
              <span className="mr-1">→</span>
              CODE
              <span className="text-green-500">_</span>
            </Link>
          )}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn-danger">
              LOGOUT
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              LOGIN
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex justify-center gap-4 text-xs tracking-[0.3em] text-green-500/70 pb-3 border-t border-green-500/10">
        <Link to="/" className="hover:text-green-300">
          HOME
        </Link>
        <span className="text-green-500/40">|</span>
        <Link to="/rounds" className="hover:text-green-300">
          ROUNDS
        </Link>
        <span className="text-green-500/40">|</span>
        <Link to="/leaderboard" className="hover:text-green-300">
          RANKS
        </Link>
        <span className="text-green-500/40">|</span>
        <Link to="/rules" className="hover:text-green-300">
          RULES
        </Link>
        <span className="text-green-500/40">|</span>
        <Link to="/profile" className="hover:text-green-300">
          PROFILE
        </Link>
      </div>

      {/* System status bar */}
      <div className="text-[10px] sm:text-xs text-green-600/60 px-4 py-2 border-t border-green-500/10 flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {isLoggedIn ? "AUTHORIZED" : "GUEST"}
        </span>
        <span className="text-cyan-600 text-center flex-1">
          <span className="text-green-500">▪</span> MINDCOMPILE v2.0
        </span>
        <span className="text-green-600 animate-cyber-pulse">ONLINE</span>
      </div>

      {/* Scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
        <div
          className="h-full w-1/4 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>
    </nav>
  );
};

export default NavBar;
