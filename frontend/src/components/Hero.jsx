import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const text = "WRITE. COMPILE. NO ERRORS. NO SECOND CHANCES.";
  const [output, setOutput] = useState("");
  const [i, setI] = useState(0);

  // Typing effect
  useEffect(() => {
    if (i < text.length) {
      const t = setTimeout(() => {
        setOutput((prev) => prev + text[i]);
        setI(i + 1);
      }, 30);
      return () => clearTimeout(t);
    }
  }, [i]);

  return (
    <section className="relative min-h-screen flex items-center bg-black text-green-400 font-mono overflow-hidden px-4 sm:px-6 lg:px-12">
      {/* Ambient pulse */}
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 animate-pulse pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* Subtle grid (adds depth) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* LEFT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_20px_#00ff00] animate-flicker">
            MINDCOMPILE
          </h1>

          <p className="text-green-500/70 text-sm sm:text-base lg:text-lg xl:text-xl max-w-xl">
            SIESCOMS’ flagship blind coding event where logic, precision, and
            pure understanding decide survival.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
            <Link
              to={"/rounds"}
              className="
              relative px-8 py-3 border border-green-400
              text-green-400 hover:bg-green-400 hover:text-black
              transition-all duration-300
              shadow-[0_0_20px_rgba(0,255,0,0.4)]
              overflow-hidden
            "
            >
              START CODING
              {/* glitch overlay */}
              <span className="absolute inset-0 opacity-0 hover:opacity-30 bg-green-300 mix-blend-overlay blur-sm"></span>
            </Link>

            <Link
              to={"/rules"}
              className="
              px-8 py-3 border border-green-500/40
              text-green-500/70 hover:text-green-300
              hover:border-green-300 transition-all duration-300
            "
            >
              VIEW RULES
            </Link>
          </div>
        </div>

        {/* RIGHT TERMINAL */}
        <div className="w-full mt-6 lg:mt-20">
          <div className="relative border border-green-500/30 bg-black/70 backdrop-blur-md p-5 sm:p-6 lg:p-8 shadow-[0_0_40px_rgba(0,255,0,0.15)]">
            {/* scan overlay inside terminal */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:100%_3px] opacity-20" />

            {/* header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            {/* fake logs before main text */}
            <div className="text-green-500/60 text-xs sm:text-sm mb-3 space-y-1">
              <p>{"> booting system..."}</p>
              <p>{"> loading modules..."}</p>
              <p>{"> access level: restricted"}</p>
            </div>

            {/* typing line */}
            <p className="text-green-400 text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide min-h-[3rem]">
              {output}
              <span className="animate-pulse">█</span>
            </p>

            {/* description */}
            <p className="mt-6 text-green-500/60 text-xs sm:text-sm lg:text-base leading-relaxed">
              Write error-free code without execution. No compiler. No
              debugging. Just logic. Three rounds. Only precision survives.
            </p>

            {/* warning */}
            <p className="mt-4 text-red-500 text-sm lg:text-base animate-flicker">
              ⚠ unauthorized debugging attempt = disqualification
            </p>
          </div>
        </div>
      </div>

      {/* Side lines */}
      <div className="hidden lg:block absolute left-0 top-0 h-full w-[2px] bg-green-500/20" />
      <div className="hidden lg:block absolute right-0 top-0 h-full w-[2px] bg-green-500/20" />

      {/* Scan bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-green-400/40 blur-sm"
          style={{ animation: "scanMove 5s linear infinite" }}
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
            animation: flicker 2.5s infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
