// @ts-nocheck
import React from "react";

const Output = ({ output }) => {
  const hasError =
    output?.toLowerCase().includes("error") ||
    output?.toLowerCase().includes("exception");

  return (
    <div className="w-full h-full font-mono flex flex-col bg-black/80">
      {/* Content Area - Main Display */}
      <div className="flex-1 overflow-y-auto p-6">
        {output ? (
          <div className="space-y-1">
            <pre
              className={`text-sm leading-relaxed font-mono whitespace-pre-wrap break-words font-semibold ${hasError ? "text-red-400" : "text-emerald-300"}`}
            >
              {output}
              <span
                className={`inline-block w-1.5 h-5 ml-1 align-middle animate-pulse ${hasError ? "bg-red-500" : "bg-emerald-400"}`}
              />
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-3xl opacity-50">▌</div>
              <p className="text-xs font-mono tracking-[0.15em] text-slate-600 uppercase">
                Awaiting output...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
