// @ts-nocheck
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NavBar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menuItems = [
    { to: "/", label: "HOME" },
    { to: "/rounds", label: "ROUNDS" },
    { to: "/leaderboard", label: "RANKS" },
    { to: "/rules", label: "RULES" },
    { to: "/profile", label: "PROFILE" },
  ];

  return (
    <nav className="border-b border-white/10 bg-[#020617] md:bg-slate-950/80 md:backdrop-blur-xl sticky top-0 z-[100] transition-all duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Terminal Style */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="hidden sm:flex w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-400 transition-all duration-300">
              <span className="text-emerald-400 text-xl font-mono">{">_"}</span>
            </div>
            <div className="flex flex-col">
              <div className="text-white font-mono font-bold tracking-widest text-sm sm:text-lg leading-none">
                <span className="text-emerald-400">root@</span>
                <span className="text-slate-300">mindcompile</span>
                <span className="text-emerald-500">:~#</span>
                <span className="terminal-cursor"></span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-500/80 text-[10px] tracking-[0.3em] font-mono uppercase">Sys_Online</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center bg-white/[0.03] p-1 rounded-sm border border-white/5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    px-4 py-2 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] transition-all duration-300 relative
                    ${isActive 
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" 
                      : "text-slate-500 hover:text-emerald-300 hover:bg-white/5"}
                  `}
                >
                  {isActive ? `[ ${item.label} ]` : item.label}
                </Link>
              );
            })}
          </div>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/code-n-submit"
                  className="hidden md:block px-6 py-2.5 bg-emerald-500 text-black text-xs font-black tracking-[0.1em] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  style={{ clipPath: "polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)" }}
                >
                  RUN_PROGRAM
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="hidden md:block text-slate-500 hover:text-rose-400 text-xs font-black tracking-widest transition-colors"
                >
                  SIG_OUT
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden md:block px-8 py-2.5 border-2 border-emerald-500/50 text-emerald-400 text-xs font-black tracking-[0.2em] hover:bg-emerald-500/10 transition-all"
                style={{ clipPath: "polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)" }}
              >
                AUTHORIZE
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1.5 active:bg-white/5 transition-colors"
            >
              <div className={`w-5 h-0.5 bg-emerald-400 transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <div className={`w-5 h-0.5 bg-emerald-400 transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-emerald-400 transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`
        fixed inset-0 top-20 z-40 md:hidden transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
      `}>
        <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl px-6 py-8 flex flex-col gap-3 z-50 overflow-y-auto border-t border-emerald-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          <div className="text-[10px] text-emerald-500/50 font-mono mb-4 tracking-[0.3em] uppercase border-b border-emerald-500/10 pb-2">
            // Available_Directories
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                text-lg font-mono tracking-widest p-4 border transition-all duration-300 flex items-center justify-between
                ${location.pathname === item.to 
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[inset_4px_0_0_0_#10b981]" 
                  : "text-slate-400 border-white/5 hover:border-emerald-500/20 hover:bg-white/5"}
              `}
            >
              <div className="flex items-center gap-4">
                <span className={`${location.pathname === item.to ? "text-emerald-500" : "text-slate-600"}`}>{">"}</span>
                {item.label}
              </div>
              {location.pathname === item.to && <span className="text-emerald-500 text-[10px] animate-pulse">ACTIVE</span>}
            </Link>
          ))}
          
          <div className="mt-auto pt-6 flex flex-col gap-4 border-t border-emerald-500/10">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/code-n-submit" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-center font-mono font-bold tracking-[0.2em] uppercase hover:bg-emerald-500 hover:text-black transition-all"
                >
                  ./execute_run
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 border border-rose-500/30 text-rose-500 font-mono tracking-[0.2em] uppercase hover:bg-rose-500/10 transition-all"
                >
                  SIGKILL -9 (Logout)
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 bg-emerald-500 text-black text-center font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                sudo authenticate
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
