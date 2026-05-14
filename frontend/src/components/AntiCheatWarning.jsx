// @ts-nocheck
import React, { useEffect, useState } from "react";

/**
 * AntiCheatWarning — Modal overlay shown for SUSPICIOUS / DOUBTFUL / CONFIRMED states.
 * CONFIRMED modal cannot be dismissed.
 */
const AntiCheatWarning = ({ visible, message, level, onDismiss }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!visible || level !== "CONFIRMED") return;
    setCountdown(5);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [visible, level]);

  if (!visible) return null;

  const config = {
    SUSPICIOUS: {
      border: "border-yellow-400",
      glow: "shadow-[0_0_40px_rgba(250,204,21,0.4)]",
      icon: "⚠️",
      iconColor: "text-yellow-400",
      title: "WARNING DETECTED",
      titleColor: "text-yellow-300",
      barColor: "bg-yellow-400",
      btnText: "I understand — return to coding",
      btnClass: "border-yellow-400 text-yellow-300 hover:bg-yellow-400/10",
      dismissable: true,
    },
    DOUBTFUL: {
      border: "border-orange-400",
      glow: "shadow-[0_0_40px_rgba(251,146,60,0.5)]",
      icon: "🚨",
      iconColor: "text-orange-400",
      title: "MULTIPLE VIOLATIONS",
      titleColor: "text-orange-300",
      barColor: "bg-orange-400",
      btnText: "I acknowledge — points have been deducted",
      btnClass: "border-orange-400 text-orange-300 hover:bg-orange-400/10",
      dismissable: true,
    },
    CONFIRMED: {
      border: "border-red-500",
      glow: "shadow-[0_0_60px_rgba(239,68,68,0.6)]",
      icon: "🔴",
      iconColor: "text-red-400",
      title: "DISQUALIFIED",
      titleColor: "text-red-400",
      barColor: "bg-red-500",
      btnText: null,
      btnClass: null,
      dismissable: false,
    },
  };

  const c = config[level] || config.SUSPICIOUS;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,0,0,0.08) 3px)",
        }}
      />

      <div
        className={`relative max-w-lg w-full mx-4 border ${c.border} ${c.glow} bg-black/95 rounded-lg overflow-hidden font-mono`}
        style={{ animation: "warningPulse 2s ease-in-out infinite" }}
      >
        {/* Top colored bar */}
        <div className={`h-1 w-full ${c.barColor} opacity-80`} />

        {/* Animated top bar for CONFIRMED */}
        {level === "CONFIRMED" && (
          <div className="h-1 bg-red-500 animate-pulse" />
        )}

        <div className="p-6 sm:p-8 space-y-5">
          {/* Icon + Title */}
          <div className="flex items-center gap-3">
            <span className={`text-3xl sm:text-4xl ${c.iconColor}`}>{c.icon}</span>
            <div>
              <div className={`text-xl sm:text-2xl font-bold tracking-widest ${c.titleColor}`}>
                {c.title}
              </div>
              <div className="text-green-500/50 text-xs mt-1">
                {">"} proctoring.system.alert
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="border border-green-500/20 bg-green-500/5 p-4 rounded text-sm text-green-300 leading-relaxed">
            {message}
          </div>

          {/* Risk details */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { label: "STATUS", value: level },
              { label: "ACTION", value: level === "CONFIRMED" ? "DISQUALIFIED" : level === "DOUBTFUL" ? "PTS DEDUCTED" : "WARNED" },
              { label: "MONITOR", value: "ACTIVE" },
            ].map(({ label, value }) => (
              <div key={label} className="border border-green-500/20 bg-black/60 p-2 rounded text-center">
                <div className="text-green-500/50">{label}</div>
                <div className={`font-bold mt-1 ${level === "CONFIRMED" ? "text-red-400" :
                    level === "DOUBTFUL" ? "text-orange-400" : "text-yellow-400"
                  }`}>{value}</div>
              </div>
            ))}
          </div>

          {/* CONFIRMED: countdown + explanation */}
          {level === "CONFIRMED" && (
            <div className="space-y-3">
              <div className="text-red-400/80 text-xs leading-relaxed">
                Your session has been terminated. Your code has been auto-submitted.
                Contest participation is locked for this round. This incident has been
                logged for review.
              </div>
              <div className="flex items-center gap-2 text-xs text-red-300/60">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
                Auto-submitting in {countdown}s...
              </div>
            </div>
          )}

          {/* Action button */}
          {c.dismissable && (
            <button
              onClick={onDismiss}
              className={`w-full border px-4 py-2.5 text-sm transition-all duration-200 rounded ${c.btnClass}`}
            >
              {c.btnText}
            </button>
          )}
        </div>

        {/* Bottom scan bar */}
        <div className="h-[2px] w-full overflow-hidden">
          <div
            className={`h-full w-1/3 ${c.barColor} blur-sm opacity-60`}
            style={{ animation: "scanSlide 2s linear infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes warningPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.002); }
        }
        @keyframes scanSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default AntiCheatWarning;
