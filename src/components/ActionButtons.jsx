import { useState } from "react";

const ActionButtons = ({
  onDownloadPNG,
  onDownloadJPEG,
  onCopyImage,
  onFlip,
  onBatchExport,
  isExporting,
}) => {
  const [showBatchMenu, setShowBatchMenu] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState({
    png: true,
    jpeg: false,
  });

  const toggleFormat = (format) => {
    setSelectedFormats((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

  const handleBatchExport = () => {
    const formats = Object.keys(selectedFormats).filter(
      (key) => selectedFormats[key]
    );
    if (formats.length === 0) {
      alert("Please select at least one format");
      return;
    }
    onBatchExport(formats);
    setShowBatchMenu(false);
  };

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-2xl bg-red-500">
      {/* Primary Actions */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={onDownloadPNG}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
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
          <span>PNG</span>
        </button>

        <button
          onClick={onDownloadJPEG}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-amber-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
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
          <span>JPEG</span>
        </button>

        <button
          onClick={() => setShowBatchMenu(!showBatchMenu)}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Batch</span>
        </button>
      </div>

      {/* Batch Export Menu */}
      {showBatchMenu && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 space-y-3 animate-fadeIn">
          <div className="text-sm font-semibold text-gray-300 mb-2">
            Select Formats to Export
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(selectedFormats).map((format) => (
              <label
                key={format}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedFormats[format]}
                  onChange={() => toggleFormat(format)}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-gray-200 uppercase">
                  {format}
                </span>
              </label>
            ))}
          </div>
          <button
            onClick={handleBatchExport}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold text-white transition-all"
          >
            Export Selected Formats
          </button>
        </div>
      )}

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          onClick={onCopyImage}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>Copy</span>
        </button>

        <button
          onClick={onFlip}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-gray-200 transition-all duration-200 shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Flip</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
