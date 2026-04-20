// @ts-nocheck
import React from "react";

const CodeScreen = ({ code, setCode }) => {
  return (
    <div className="relative w-full h-full group">
      {/* Glow background */}
      <div className="absolute inset-0 bg-green-500/5 blur-xl opacity-30 group-focus-within:opacity-60 transition duration-300 pointer-events-none" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:100%_3px] opacity-20" />

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        // onPaste={(e) => e.preventDefault()}
        spellCheck={false}
        className="
          relative z-10
          w-full h-full p-4
          bg-black/90
          text-green-400
          placeholder-green-600
          font-mono text-sm sm:text-base
          border border-green-500/40
          rounded-lg
          resize-none
          backdrop-blur-sm
          focus:outline-none
          focus:ring-2 focus:ring-green-400/70
          focus:border-green-300
          shadow-[0_0_15px_rgba(0,255,0,0.2)]
          transition-all duration-300
        "
        placeholder="// initialize protocol..."
      />
    </div>
  );
};

export default CodeScreen;
