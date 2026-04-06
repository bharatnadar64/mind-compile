// @ts-nocheck
import React from "react";

const CodeScreen = ({ code, setCode }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      className="w-full h-full  p-4 bg-black text-green-400 font-mono text-sm sm:text-base border border-green-500 rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
      placeholder="// Write your code here..."
    />
  );
};

export default CodeScreen;
