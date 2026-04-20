import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="pt-3.5 relative bg-black text-green-400 font-mono overflow-hidden">
      {/* Ambient Glow Pulse */}
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 animate-pulse pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* Top glow border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-40" />

      {/* MAIN */}
      <div className="w-full px-6 sm:px-10 lg:px-20 xl:px-32 py-16 lg:py-24 relative z-10">
        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* BRAND */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_12px_#00ff00] animate-pulse">
              MINDCOMPILE
            </h2>

            <p className="text-green-500/70 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
              A blind coding battleground where execution is forbidden and only
              real programmers survive under pressure.
            </p>

            <p className="text-green-500/50 text-xs sm:text-sm animate-flicker">
              {"> system.status: ACTIVE"}
            </p>
          </div>

          {/* NAV */}
          <div className="space-y-6">
            <h3 className="text-green-300 tracking-wider text-sm sm:text-base">
              NAVIGATION
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-green-500/70">
              {["/", "/about", "/rounds", "/rules"].map((path, i) => {
                const labels = ["Home", "About", "Rounds", "Rules"];
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className="group relative inline-block hover:text-green-300 transition-all duration-200"
                    >
                      <span className="mr-2">{">"}</span>
                      {labels[i]}

                      {/* Hover glitch */}
                      <span className="absolute left-0 top-0 opacity-0 group-hover:opacity-40 text-green-300 blur-[1px] translate-x-[1px]">
                        {labels[i]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SYSTEM */}
          <div className="space-y-6">
            <h3 className="text-green-300 tracking-wider text-sm sm:text-base">
              SYSTEM INFO
            </h3>

            <div className="text-sm sm:text-base text-green-500/70 space-y-3">
              <p>{"> event: SIESCOMS MindCompile"}</p>
              <p>{"> mode: Blind Coding"}</p>
              <p>{"> rounds: 3"}</p>

              <p className="text-red-500 animate-pulse">
                {"> warning: No Debugging Allowed"}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-[1px] bg-green-500/20" />

        {/* BOTTOM */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm sm:text-base text-green-500/60">
          <p className="text-center lg:text-left">
            © {new Date().getFullYear()} MINDCOMPILE // SIESCOMS
          </p>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>

            <span className="tracking-wider animate-flicker">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Side structure lines */}
      <div className="hidden lg:block absolute left-0 top-0 h-full w-[2px] bg-green-500/20" />
      <div className="hidden lg:block absolute right-0 top-0 h-full w-[2px] bg-green-500/20" />

      {/* Moving scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 6s linear infinite" }}
        />
      </div>

      {/* Styles */}
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
            animation: flicker 3s infinite;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
