// @ts-nocheck
import React from "react";
const Problem = ({
  title,
  difficulty,
  description,
  sampleInput,
  sampleOutput,
  className = "",
}) => {
  return (
    <div
      className={`h-[90vh] w-full bg-black/80 border border-green-500/40 rounded shadow-[0_0_25px_rgba(0,255,0,0.2)] p-6 flex flex-col gap-4 text-green-400 font-mono ${className}`}
    >
      {/* Problem Title & Difficulty */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold drop-shadow-[0_0_10px_#00ff00]">
          {title || "Problem Title"}
        </h2>
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            difficulty === "Easy"
              ? "bg-green-600/30 text-green-200"
              : difficulty === "Medium"
                ? "bg-yellow-600/30 text-yellow-200"
                : "bg-red-600/30 text-red-400"
          }`}
        >
          {difficulty || "Medium"}
        </span>
      </div>

      {/* Problem Description */}
      <div className="text-green-400/80 text-sm sm:text-base flex-1 overflow-y-auto leading-relaxed">
        {description ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet."}
      </div>

      {/* Sample Input & Output */}
      {sampleInput && (
        <div className="bg-black/70 border border-green-500/30 rounded p-3">
          <span className="font-semibold text-green-300">Sample Input:</span>
          <pre className="whitespace-pre-wrap">{sampleInput}</pre>
        </div>
      )}
      {sampleOutput && (
        <div className="bg-black/70 border border-green-500/30 rounded p-3">
          <span className="font-semibold text-green-300">Sample Output:</span>
          <pre className="whitespace-pre-wrap">{sampleOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default Problem;
