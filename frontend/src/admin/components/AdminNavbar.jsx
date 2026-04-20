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
    <div className="relative bg-black border-b border-red-500/40 font-mono text-red-400 overflow-hidden">
      {/* subtle red system glow */}
      <div className="absolute inset-0 bg-red-500/5 blur-xl opacity-20 pointer-events-none" />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.12) 3px)",
        }}
      />

      <div className="relative flex flex-wrap items-center gap-6 p-4">
        {/* System label */}
        <div className="text-red-500 font-bold tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]">
          {"> ADMIN CONTROL PANEL"}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-5 text-sm sm:text-base">
          {[
            { to: "/admin", label: "Dashboard" },
            { to: "/admin/leaderboard", label: "Leaderboard" },
            { to: "/admin/submissions", label: "Submissions" },
            { to: "/admin/users", label: "Users" },
            { to: "/admin/rounds", label: "Rounds" },
            { to: "/admin/problems", label: "Problems" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="
                relative group transition-all duration-200
                text-red-400 hover:text-red-300
              "
            >
              <span className="mr-1">{">"}</span>
              {item.label}

              {/* glitch hover effect */}
              <span className="absolute left-0 top-0 opacity-0 group-hover:opacity-40 text-red-300 blur-[1px] translate-x-[1px]">
                {item.label}
              </span>
            </Link>
          ))}

          {/* logout */}
          <button
            onClick={handleLogout}
            className="
              ml-2 px-3 py-1 border border-red-500
              text-red-400 hover:bg-red-500 hover:text-black
              transition-all duration-300
              shadow-[0_0_10px_rgba(255,0,0,0.3)]
            "
          >
            EXIT SYSTEM
          </button>
        </div>
      </div>

      {/* bottom warning strip */}
      <div className="text-[10px] sm:text-xs text-red-500/60 px-4 py-1 border-t border-red-500/10 flex justify-between">
        <span>{"> access.level: ROOT"}</span>
        <span className="animate-pulse">{"> surveillance: ACTIVE"}</span>
      </div>
    </div>
  );
};

export default AdminNavbar;
