import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-black text-green-300 font-mono overflow-hidden">
      {/* ===== BACKGROUND ENGINE ===== */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-black to-black opacity-80 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.10) 3px)",
        }}
      />

      {/* soft ambient node glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,0,0.12),transparent_55%)] pointer-events-none animate-pulse" />

      {/* top border signal line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30" />

      {/* ===== MAIN ===== */}
      <div className="relative z-10 px-4 sm:px-10 lg:px-24 py-12 sm:py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* ===== BRAND ===== */}
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[0.25em] text-green-200">
              MINDCOMPILE
            </h2>

            <p className="text-green-500/70 text-sm sm:text-base leading-relaxed max-w-sm">
              A blind coding arena where execution is disabled and logic is the
              only weapon.
            </p>

            <p className="text-xs text-green-500/50 tracking-widest animate-pulse">
              system.status :: ACTIVE
            </p>
          </div>

          {/* ===== NAVIGATION ===== */}
          <div className="space-y-5">
            <h3 className="text-green-300 text-sm tracking-[0.3em]">
              NAVIGATION
            </h3>

            <ul className="space-y-3 text-sm sm:text-base">
              {["/", "/about", "/rounds", "/rules"].map((path, i) => {
                const labels = ["Home", "About", "Rounds", "Rules"];

                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className="
                      group inline-flex items-center gap-2
                      text-green-500/70
                      hover:text-green-200
                      transition
                      relative
                    "
                    >
                      <span className="text-green-400/60 group-hover:text-green-300">
                        &gt;
                      </span>

                      <span>{labels[i]}</span>

                      {/* hover glow line */}
                      <span
                        className="
                      absolute left-0 -bottom-1
                      w-0 h-[1px]
                      bg-green-400/60
                      group-hover:w-full
                      transition-all duration-300
                    "
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ===== SYSTEM INFO ===== */}
          <div className="space-y-5">
            <h3 className="text-green-300 text-sm tracking-[0.3em]">SYSTEM</h3>

            <div className="space-y-3 text-sm text-green-500/70">
              <p>event :: SIESCOMS MindCompile</p>
              <p>mode :: Blind Coding Arena</p>
              <p>rounds :: 3 stages</p>

              <p className="text-red-400/80 animate-pulse">
                WARNING :: Debugging Disabled
              </p>
            </div>
          </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className="my-10 h-[1px] bg-green-500/20" />

        {/* ===== BOTTOM BAR ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs sm:text-sm text-green-500/60">
          <p className="tracking-wide text-center sm:text-left">
            © {new Date().getFullYear()} MINDCOMPILE // SYSTEM CORE
          </p>

          <div className="flex items-center gap-3">
            {/* live indicator */}
            <span className="relative flex h-3 w-3">
              <span className="absolute h-full w-full rounded-full bg-green-400 opacity-70 animate-ping" />
              <span className="relative h-3 w-3 rounded-full bg-green-400" />
            </span>

            <span className="tracking-widest text-green-400/70">ONLINE</span>
          </div>
        </div>
      </div>

      {/* ===== EDGE STRUCTURE ===== */}
      <div className="hidden lg:block absolute left-0 top-0 h-full w-[1px] bg-green-500/20" />
      <div className="hidden lg:block absolute right-0 top-0 h-full w-[1px] bg-green-500/20" />

      {/* ===== SCAN LINE (subtle) ===== */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/4 bg-green-400/30 blur-sm"
          style={{ animation: "scanMove 7s linear infinite" }}
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
    </footer>
  );
};

export default Footer;
