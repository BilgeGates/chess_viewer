import { X, FileImage, Pause, Play, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Export Progress Modal with Pause/Resume and Cancel
 */
const ExportProgress = ({
  isExporting,
  progress,
  currentFormat,
  config,
  onClose,
  onPause,
  onResume,
  onCancel,
  isPaused,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    if (!isExporting || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= progress) return progress;

        const diff = progress - prev;
        const increment = Math.max(2, Math.min(10, diff / 3));

        return Math.min(progress, prev + increment);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress, isExporting, isPaused]);

  // Reset on export complete
  useEffect(() => {
    if (!isExporting) {
      setDisplayProgress(0);
    }
  }, [isExporting]);

  if (!isExporting) return null;

  const format = currentFormat || "png";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-850 to-gray-900 border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-xl w-full relative animate-fadeIn">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 hover:bg-gray-800 rounded-lg transition-colors group"
            title="Hide modal"
          >
            <X
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-white transition-colors"
              strokeWidth={2}
            />
          </button>
        )}

        <div className="space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/15 rounded-xl border border-blue-500/20">
              <FileImage
                className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400"
                strokeWidth={2}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                Exporting {format.toUpperCase()}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                {isPaused ? "⏸ Paused" : "Creating high-quality image"}
              </p>
            </div>
          </div>

          {/* Dual Range Progress Bar */}
          <div className="space-y-4">
            <div className="flex-1 relative h-2.5">
              <div className="flex gap-1 h-full items-center">
                {/* Blue Range */}
                <div
                  className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-150 ease-linear relative overflow-hidden"
                  style={{ width: `${displayProgress}%` }}
                >
                  {!isPaused && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      style={{
                        animation: "shimmer 1.5s infinite linear",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  )}
                </div>

                {/* Gray Range */}
                <div
                  className="h-1.5 bg-gray-700/80 rounded-full transition-all duration-150 ease-linear"
                  style={{ width: `${Math.max(0, 100 - displayProgress)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            {/* Pause/Resume Button */}
            {onPause && onResume && (
              <button
                onClick={isPaused ? onResume : onPause}
                className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-semibold text-xs sm:text-sm"
              >
                {isPaused ? (
                  <>
                    <Play
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      strokeWidth={2.5}
                      fill="currentColor"
                    />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      strokeWidth={2.5}
                    />
                    <span>Pause</span>
                  </>
                )}
              </button>
            )}

            {/* Cancel Button */}
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-white font-semibold text-xs sm:text-sm"
              >
                <XCircle
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  strokeWidth={2.5}
                />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ExportProgress;
