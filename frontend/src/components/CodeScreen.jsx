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
        onPaste={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();

            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const value = code;
            const indent = "    "; // 4 spaces

            // Get start of first selected line
            const lineStart = value.lastIndexOf("\n", start - 1) + 1;

            // Get end of last selected line
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
              // 🔹 SHIFT + TAB → UNINDENT
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
              // 🔹 TAB → INDENT
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
        className="relative z-10 w-full h-full p-4 bg-black/90 text-green-400 placeholder-green-600 font-mono text-sm sm:text-base border border-green-500/40 rounded-lg resize-none backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400/70 focus:border-green-300 shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all duration-300"
        placeholder="// initialize protocol..."
      />
    </div>
  );
};

export default CodeScreen;
