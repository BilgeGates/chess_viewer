/**
 * Loading spinner
 */
export const LoadingSpinner = ({ size = "md", message = "Loading..." }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      {message && (
        <div className="text-sm text-gray-400 font-medium">{message}</div>
      )}
    </div>
  );
};

/**
 * Progress bar
 */
export const ProgressBar = ({ progress, message = "" }) => {
  return (
    <div className="w-full space-y-2">
      {message && (
        <div className="text-sm text-gray-400 font-medium">{message}</div>
      )}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 text-right">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

/**
 * Export progress overlay
 */
export const ExportProgress = ({ isExporting, progress, currentFormat }) => {
  if (!isExporting) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4">
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-500 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Exporting...
            </h3>
            {currentFormat && (
              <p className="text-sm text-gray-400">
                Generating {currentFormat.toUpperCase()} file
              </p>
            )}
          </div>

          <ProgressBar progress={progress} />

          <p className="text-xs text-gray-500 text-center">
            Please wait while we generate your high-quality export
          </p>
        </div>
      </div>
    </div>
  );
};
