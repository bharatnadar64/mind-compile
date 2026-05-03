// @ts-nocheck
import React from "react";

const CodeScreen = ({ code, setCode }) => {
  return (
    <div className="relative w-full h-full group scene-3d depth-panel card-3d">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5 blur-xl opacity-40 group-focus-within:opacity-80 transition duration-500 pointer-events-none" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines-fine opacity-10" />

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onPaste={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();

            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const value = code;
            const indent = "    ";

            const lineStart = value.lastIndexOf("\n", start - 1) + 1;
            const lineEnd =
              value.indexOf("\n", end) === -1
                ? value.length
                : value.indexOf("\n", end);

            const selectedText = value.slice(lineStart, lineEnd);
            const lines = selectedText.split("\n");

            let newLines;
            let newStart = start;
            let newEnd = end;

            if (e.shiftKey) {
              newLines = lines.map((line) => {
                if (line.startsWith(indent)) {
                  newEnd -= indent.length;
                  if (lineStart < start) newStart -= indent.length;
                  return line.slice(indent.length);
                } else if (line.startsWith(" ")) {
                  newEnd -= 1;
                  if (lineStart < start) newStart -= 1;
                  return line.slice(1);
                }
                return line;
              });
            } else {
              newLines = lines.map((line) => indent + line);

              const addedSpaces = indent.length * lines.length;
              newStart += indent.length;
              newEnd += addedSpaces;
            }

            const newValue =
              value.slice(0, lineStart) +
              newLines.join("\n") +
              value.slice(lineEnd);

            setCode(newValue);

            setTimeout(() => {
              textarea.selectionStart = newStart;
              textarea.selectionEnd = newEnd;
            }, 0);
          }
        }}
        spellCheck={false}
        className="relative z-10 w-full h-full p-5 bg-slate-950/90 text-green-300 placeholder-green-700/60 font-mono text-sm sm:text-base terminal-border-bright rounded-lg resize-none backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400/80 focus:border-green-300 focus:shadow-[0_0_25px_rgba(0,255,0,0.4)] transition-all duration-300"
        placeholder="// [CODE_EDITOR_INITIALIZED]\n// Write your solution here..."
      />
    </div>
  );
};

export default CodeScreen;
