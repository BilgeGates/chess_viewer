const StatusMessage = ({ message, type }) => {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`px-6 py-3 rounded-lg text-center text-sm font-medium w-full max-w-2xl transition-all duration-300 animate-fade-in ${
        isSuccess
          ? "bg-green-900/40 text-green-300 border border-green-700/50 shadow-lg shadow-green-900/20"
          : "bg-red-900/40 text-red-300 border border-red-700/50 shadow-lg shadow-red-900/20"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {isSuccess ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {message}
      </div>
    </div>
  );
};

export default StatusMessage;
