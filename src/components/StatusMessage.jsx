const StatusMessage = ({ message, type }) => {
  if (!message) return null;

  return (
    <div
      className={`px-4 py-3 rounded-lg text-center font-medium text-sm border mt-4 animate-fade-in ${
        type === "success"
          ? "bg-green-900 bg-opacity-20 text-green-400 border-green-800 border-opacity-50"
          : "bg-red-900 bg-opacity-20 text-red-400 border-red-800 border-opacity-50"
      }`}
    >
      {message}
    </div>
  );
};

export default StatusMessage;
