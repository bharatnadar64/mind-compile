import { useState, useEffect } from "react";

const NavBar = () => {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setBlink((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 
      bg-black/85 backdrop-blur-md 
      border-b border-green-500/20 
      shadow-[0_0_20px_rgba(0,255,0,0.15)] overflow-hidden"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      <div
        className="max-w-6xl mx-auto 
        flex flex-col sm:flex-row 
        items-start sm:items-center 
        justify-between 
        px-4 py-2 gap-2 sm:gap-0
        font-mono text-xs md:text-sm text-green-400 relative"
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <span
            className="font-bold tracking-widest 
            text-green-400 
            drop-shadow-[0_0_8px_#00ff00]"
          >
            ▶ MINDCOMPILE
            <span
              className={`ml-1 ${
                blink ? "opacity-100" : "opacity-0"
              } transition-opacity`}
            >
              _
            </span>
          </span>

          <span className="hidden md:inline text-green-500/50">
            // UNAUTHORIZED SESSION
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status */}
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            <span className="tracking-wider text-green-300">CONNECTED</span>
          </span>

          {/* Time */}
          <span className="text-green-500/70 whitespace-nowrap">
            [{time.toLocaleTimeString("en-GB")}]
          </span>

          {/* Date */}
          <span className="hidden sm:inline text-green-500/50">
            {time.toLocaleDateString("en-GB")}
          </span>

          {/* Recording */}
          <span className="text-red-500 flex items-center gap-1">
            <span className="animate-pulse">●</span>
            <span className="hidden md:inline">REC</span>
          </span>
        </div>
      </div>

      {/* Moving scan bar (inline animation, no config) */}
      <div className="relative h-[2px] w-full overflow-hidden">
        <div
          className="absolute h-full w-1/3 bg-green-400/40 blur-sm"
          style={{
            animation: "scanMove 4s linear infinite",
          }}
        />
      </div>

      {/* Inline keyframes (no tailwind config needed) */}
      <style>
        {`
          @keyframes scanMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}
      </style>
    </nav>
  );
};

export default NavBar;
