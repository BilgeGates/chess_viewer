import React from "react";

const StatusMessage = ({ message, type }) => {
  if (!message) return null;

  return (
    <div
      className={`px-4 py-2.5 rounded text-center text-sm font-medium w-full max-w-lg ${
        type === "success"
          ? "bg-green-900/30 text-green-400 border border-green-800/50"
          : "bg-red-900/30 text-red-400 border border-red-800/50"
      }`}
    >
      {message}
    </div>
  );
};

export default StatusMessage;
