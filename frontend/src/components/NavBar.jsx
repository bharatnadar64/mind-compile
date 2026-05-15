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
    <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-[100] transition-all duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-400 group-hover:scale-110 transition-all duration-300">
              <span className="text-emerald-400 text-xl">⚡</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-[0.15em] text-lg leading-none">MINDCOMPILE</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-500/60 text-xs tracking-[0.2em] font-mono">SYSTEM_ONLINE</span>
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
                    px-6 py-2 text-xs font-black tracking-[0.2em] transition-all duration-300 relative
                    ${isActive 
                      ? "text-emerald-400 bg-emerald-500/10" 
                      : "text-slate-500 hover:text-emerald-300 hover:bg-white/5"}
                  `}
                  style={isActive ? { clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 30%)" } : {}}
                >
                  {item.label}
                  {isActive && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981]" />}
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
                  className="px-6 py-2.5 bg-emerald-500 text-black text-xs font-black tracking-[0.1em] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
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
        fixed inset-0 top-20 z-40 md:hidden transition-all duration-500 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}>
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl px-6 py-8 flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                text-2xl font-bold tracking-tighter p-4 rounded-2xl border border-white/5
                ${location.pathname === item.to ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-slate-500"}
              `}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-4">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/code-n-submit" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-black text-center font-bold text-lg"
                >
                  START_CODING
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 rounded-2xl border border-rose-500/30 text-rose-500 font-bold"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 rounded-2xl bg-emerald-500 text-black text-center font-bold text-lg"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
