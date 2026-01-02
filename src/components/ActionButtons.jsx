import { useState } from "react";
import { Download, Image, Copy, Heart, RefreshCcw } from "lucide-react";

const ActionButtons = ({
  onDownloadPNG,
  onDownloadJPEG,
  onCopyImage,
  onFlip,
  onBatchExport,
  onAddToFavorites,
  isExporting,
  currentFen,
  isFavorite,
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
    <div className="space-y-3 sm:space-y-4 w-full max-w-2xl">
      {/* Primary Actions */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={onDownloadPNG}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Download
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
            strokeWidth={2.5}
          />
          <span>PNG</span>
        </button>

        <button
          onClick={onDownloadJPEG}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-amber-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Download
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
            strokeWidth={2.5}
          />
          <span>JPEG</span>
        </button>

        <button
          onClick={() => setShowBatchMenu(!showBatchMenu)}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Image
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
            strokeWidth={2.5}
          />
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
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={onCopyImage}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Copy
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
            strokeWidth={2.5}
          />
          <span>Copy</span>
        </button>

        <button
          onClick={onAddToFavorites}
          disabled={isExporting}
          className={`group px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            isFavorite
              ? "bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 hover:shadow-red-500/50"
              : "bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 active:scale-95 hover:shadow-pink-500/50"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
              isFavorite
                ? "fill-current scale-110"
                : "group-hover:scale-110 group-hover:fill-current"
            }`}
            strokeWidth={2.5}
          />
          <span className="hidden sm:inline">
            {isFavorite ? "Saved" : "Save"}
          </span>
          <span className="sm:hidden">Saved</span>
        </button>

        <button
          onClick={onFlip}
          disabled={isExporting}
          className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-gray-200 transition-all duration-200 shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <RefreshCcw
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500"
            strokeWidth={2.5}
          />
          <span>Flip</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
