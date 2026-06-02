// @ts-nocheck
import React from "react";

const CodeScreen = ({ code, setCode }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />

      {/* Subtle glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/10" />

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
        className="relative z-10 w-full h-full p-6 bg-black text-emerald-400 placeholder-emerald-700/40 font-mono text-sm leading-relaxed resize-none focus:outline-none transition-all duration-300"
        placeholder="// Write your solution here...&#10;&#10;"
      />
    </div>
  );
};

export default CodeScreen;
