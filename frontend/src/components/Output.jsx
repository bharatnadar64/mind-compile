// @ts-nocheck
import React from "react";

const Output = ({ output }) => {
  const hasError =
    output?.toLowerCase().includes("error") ||
    output?.toLowerCase().includes("exception");

  return (
    <div className="relative w-full h-full font-mono text-slate-300 p-6 flex flex-col">
      {/* Header with status indicator */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${hasError ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : output ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-700"}`} />
          <span className="text-xs font-black tracking-[0.3em] uppercase text-slate-500">
            {hasError ? "Security_Alert" : "System_Response"}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-700 tracking-widest uppercase">
          {output ? "Stream_Active" : "Awaiting_Packets"}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {output ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-2 py-0.5 rounded uppercase ${hasError ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-400"}`}>
                {hasError ? "ERROR" : "STDOUT"}
              </span>
            </div>
            <pre className={`text-[15px] leading-relaxed font-mono whitespace-pre-wrap ${hasError ? "text-rose-400/90" : "text-slate-300"}`}>
              {output}
              <span className={`inline-block w-2 h-4 ml-1 align-middle animate-pulse ${hasError ? "bg-rose-500" : "bg-emerald-500"}`} />
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs font-mono tracking-[0.4em] text-slate-700 uppercase animate-pulse">
              Listening_for_incoming_data...
            </p>
          </div>
        )}
      </div>

      {/* Footer Accent */}
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[11px] font-mono text-slate-800 uppercase tracking-widest">
        <span>Packet_Integrity: 100%</span>
        <span>MC_OS_RUNTIME</span>
      </div>
    </div>
  );
};

export default Output;
