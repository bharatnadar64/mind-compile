// src/admin/components/AdminNavbar.jsx

import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="relative bg-black border-b border-cyan-500/40 font-mono text-cyan-400 overflow-hidden">
      {/* ===== INLINE FX (self-contained) ===== */}
      <style>{`
      @keyframes blink { 50% { opacity: 0; } }
      @keyframes flicker {
        0% { opacity: 0.85; }
        50% { opacity: 1; }
        100% { opacity: 0.9; }
      }
      @keyframes glitch {
        0% { transform: translate(0); }
        25% { transform: translate(-1px, 1px); }
        50% { transform: translate(1px, -1px); }
        75% { transform: translate(-1px, -1px); }
        100% { transform: translate(0); }
      }

      .blink { animation: blink 1s step-end infinite; }
      .flicker { animation: flicker 2s infinite alternate; }
      .glitch:hover { animation: glitch 0.15s infinite; }
    `}</style>

      {/* ===== BACKGROUND FX ===== */}

      {/* glow */}
      <div className="absolute inset-0 bg-cyan-500/5 blur-2xl opacity-30 pointer-events-none" />

      {/* grid overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(#06b6d4_1px,transparent_1px),linear-gradient(90deg,#06b6d4_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.14) 3px)",
        }}
      />

      {/* subtle noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ===== CONTENT ===== */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 p-3 sm:p-4">
        {/* System label */}
        <div className="text-cyan-500 font-black font-mono tracking-widest drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center gap-2 flicker text-xs sm:text-sm md:text-base uppercase">
          <span>{">"}</span>
          <span>root@admin:~#</span>
          <span className="blink text-cyan-500">█</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 sm:gap-5 text-xs sm:text-sm md:text-base font-mono font-black uppercase tracking-widest">
          {[
            { to: "/admin", label: "Dashboard" },
            { to: "/admin/leaderboard", label: "Leaderboard" },
            { to: "/admin/submissions", label: "Submissions" },
            { to: "/admin/users", label: "Users" },
            { to: "/admin/rounds", label: "Rounds" },
            { to: "/admin/problems", label: "Problems" },
            { to: "/admin/anticheat", label: "Anti-Cheat" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="
              relative group transition-all duration-200
              text-cyan-500 hover:text-cyan-400 glitch
            "
            >
              <span className="mr-1 text-cyan-500/50">{">"}</span>
              {item.label}

              {/* glitch ghost */}
              <span className="absolute left-0 top-0 opacity-0 group-hover:opacity-40 text-cyan-300 blur-[1px] translate-x-[2px]">
                {item.label}
              </span>

              {/* underline beam */}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          {/* logout */}
          <button
            onClick={handleLogout}
            className="
            ml-2 px-3 py-1 border border-cyan-500/50 bg-cyan-500/10
            text-cyan-400 hover:bg-cyan-500 hover:text-black
            transition-all duration-300
            shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]
            glitch uppercase text-xs sm:text-sm
          "
          >
            ./exit_sys
          </button>
        </div>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div className="text-xs sm:text-sm text-cyan-500/60 px-4 py-1 border-t border-cyan-500/10 flex justify-between">
        <span>{"> access.level: ROOT"}</span>
        <span className="animate-pulse">{"> surveillance: ACTIVE"}</span>
      </div>
    </div>
  );
};

export default AdminNavbar;
