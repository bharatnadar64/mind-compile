// @ts-nocheck
import React from "react";

const Output = ({ output }) => {
  return (
    <div className="w-full h-full p-4 bg-black text-green-400 font-mono text-sm sm:text-base border border-green-500 rounded overflow-y-auto">
      {output || "Output will appear here..."}
    </div>
  );
};

export default Output;
