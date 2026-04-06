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
      }, 35);
      return () => clearTimeout(t);
    }
  }, [i]);

  return (
    <section className="relative min-h-screen flex items-center bg-black text-green-400 font-mono overflow-hidden px-4 sm:px-6 lg:px-12">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,255,0,0.08),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* LEFT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8">
          <h1
            className="
            text-4xl sm:text-6xl lg:text-7xl xl:text-8xl
            font-bold tracking-widest
            text-green-400
            drop-shadow-[0_0_15px_#00ff00]
          "
          >
            MINDCOMPILE
          </h1>

          <p
            className="
            text-green-500/70
            text-sm sm:text-base lg:text-lg xl:text-xl
            max-w-xl
          "
          >
            SIESCOMS’ flagship blind coding event where logic, precision, and
            pure understanding decide survival.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
            <Link
              to={"/rounds"}
              className="
              px-8 py-3 border border-green-400
              text-green-400 hover:bg-green-400 hover:text-black
              transition-all duration-300
              shadow-[0_0_15px_rgba(0,255,0,0.3)]
            "
            >
              START CODING
            </Link>

            <Link
              to={"/rules"}
              className="
              px-8 py-3 border border-green-500/40
              text-green-500/70 hover:text-green-400
              hover:border-green-400 transition-all duration-300
            "
            >
              VIEW RULES
            </Link>
          </div>
        </div>

        {/* RIGHT (TERMINAL) */}
        <div className="w-full mt-6 lg:mt-20">
          <div
            className="
            border border-green-500/30
            bg-black/60 backdrop-blur-md
            p-5 sm:p-6 lg:p-8
            shadow-[0_0_30px_rgba(0,255,0,0.15)]
          "
          >
            {/* Fake terminal header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            <p className="text-green-500/60 text-xs sm:text-sm mb-3">
              {"> initializing mindcompile.sys"}
            </p>

            <p
              className="
              text-green-400
              text-base sm:text-lg lg:text-xl xl:text-2xl
              tracking-wide min-h-[3rem]
            "
            >
              {output}
              <span className="animate-pulse">_</span>
            </p>

            <p className="mt-6 text-green-500/60 text-xs sm:text-sm lg:text-base leading-relaxed">
              Write error-free code without execution. No compiler. No
              debugging. Just logic. Three rounds. Only precision survives.
            </p>

            <p className="mt-4 text-red-500 text-sm lg:text-base animate-pulse">
              ⚠ Vibecoders will be eliminated.
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

      {/* Keyframes */}
      <style>
        {`
          @keyframes scanMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
