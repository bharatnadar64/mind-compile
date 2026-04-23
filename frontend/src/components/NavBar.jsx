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
      {/* ===== BACKGROUND ENGINE ===== */}
      <div className="absolute inset-0 bg-green-500/5 blur-3xl opacity-20 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,0,0.12) 4px)",
        }}
      />

      {/* subtle energy drift */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,0,0.10),transparent_60%)] pointer-events-none" />

      {/* ===== MAIN ROW ===== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        {/* ===== LOGO ===== */}
        <Link
          to="/"
          className="
          text-green-300
          font-bold
          tracking-[0.35em]
          text-lg sm:text-xl
          drop-shadow-[0_0_14px_#00ff00]
        "
        >
          &gt; MINDCOMPILE
        </Link>

        {/* ===== NAV LINKS (BIG UPGRADE HERE) ===== */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { to: "/", label: "HOME" },
            { to: "/rounds", label: "ROUNDS" },
            { to: "/leaderboard", label: "RANKS" },
            { to: "/rules", label: "RULES" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="
              relative group
              text-green-400/70
              hover:text-green-200
              transition-all duration-200

              text-lg sm:text-xl   /* 👈 BIGGER LINKS */
              tracking-[0.25em]
            "
            >
              <span className="text-green-400/50 group-hover:text-green-300 mr-2">
                &gt;
              </span>

              {item.label}

              {/* underline system pulse */}
              <span
                className="
              absolute left-0 -bottom-2
              h-[2px] w-0
              bg-green-400/60
              group-hover:w-full
              transition-all duration-300
            "
              />
            </Link>
          ))}

          {/* protected link */}
          {isLoggedIn && (
            <Link
              to="/code-n-submit"
              className="
              text-green-300
              text-lg sm:text-xl
              tracking-[0.25em]
              hover:text-green-200
              transition
            "
            >
              &gt; CODE
            </Link>
          )}
        </div>

        {/* ===== AUTH BUTTON ===== */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="
              px-4 py-2
              border border-red-500/60
              text-red-400
              hover:bg-red-500 hover:text-black
              transition-all duration-300
              text-sm sm:text-base
              tracking-[0.25em]
              active:scale-95
              shadow-[0_0_12px_rgba(255,0,0,0.3)]
            "
            >
              LOGOUT
            </button>
          ) : (
            <Link
              to="/login"
              className="
              px-4 py-2
              border border-green-400/60
              text-green-300
              hover:bg-green-400 hover:text-black
              transition-all duration-300
              text-sm sm:text-base
              tracking-[0.25em]
              active:scale-95
              shadow-[0_0_12px_rgba(0,255,0,0.3)]
            "
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>

      {/* ===== MOBILE STRIP (cleaner, not childish labels) ===== */}
      <div className="md:hidden flex justify-center gap-6 text-xs tracking-[0.3em] text-green-500/70 pb-3">
        <span>HOME</span>
        <span>ROUNDS</span>
        <span>RANKS</span>
        <span>RULES</span>
      </div>

      {/* ===== SYSTEM STATUS BAR ===== */}
      <div className="text-[10px] sm:text-xs text-green-500/60 px-4 py-1 border-t border-green-500/10 flex justify-between">
        <span>{"> user.status: " + (isLoggedIn ? "AUTHORIZED" : "GUEST")}</span>

        <span className="text-green-400 animate-pulse">
          {"> system.stability: NOMINAL"}
        </span>
      </div>

      {/* ===== SCANLINE ===== */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/4 bg-green-400/30 blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
        />
      </div>

      {/* ===== ANIMATION ===== */}
      <style>
        {`
        @keyframes scanMove {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
      `}
      </style>
    </nav>
  );
};

export default NavBar;
