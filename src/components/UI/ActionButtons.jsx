import React, { useState } from 'react';
import { Download, Image, Copy, Heart, RefreshCcw } from 'lucide-react';

const ActionButtons = React.memo(
  ({
    onDownloadPNG,
    onDownloadJPEG,
    onCopyImage,
    onFlip,
    onBatchExport,
    onAddToFavorites,
    isExporting,
    isFavorite
  }) => {
    const [showBatchMenu, setShowBatchMenu] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState({
      png: true,
      jpeg: false
    });

    const toggleFormat = (format) => {
      setSelectedFormats((prev) => ({ ...prev, [format]: !prev[format] }));
    };

    const handleBatchExport = () => {
      const formats = Object.keys(selectedFormats).filter(
        (key) => selectedFormats[key]
      );
      if (formats.length === 0) {
        alert('Please select at least one format');
        return;
      }
      onBatchExport(formats);
      setShowBatchMenu(false);
    };

    return (
      <div
        className="space-y-3 sm:space-y-4 w-full max-w-2xl"
        role="group"
        aria-label="Export and board actions"
      >
        {/* Primary Actions */}
        <div
          className="grid grid-cols-3 gap-2 sm:gap-3"
          role="group"
          aria-label="Download options"
        >
          <button
            onClick={onDownloadPNG}
            disabled={isExporting}
            aria-label="Download board as PNG image"
            aria-disabled={isExporting}
            className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <Download
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>PNG</span>
          </button>

          <button
            onClick={onDownloadJPEG}
            disabled={isExporting}
            aria-label="Download board as JPEG image"
            aria-disabled={isExporting}
            className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <Download
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>JPEG</span>
          </button>

          <button
            onClick={() => setShowBatchMenu(!showBatchMenu)}
            disabled={isExporting}
            aria-label="Open batch export menu"
            aria-expanded={showBatchMenu}
            aria-disabled={isExporting}
            className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <Image
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>Batch</span>
          </button>
        </div>

        {/* Batch Export Menu */}
        {showBatchMenu && (
          <div
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 space-y-3 animate-fadeIn"
            role="region"
            aria-label="Batch export options"
          >
            <div className="text-sm font-semibold text-gray-300 mb-2">
              Select Formats to Export
            </div>
            <div
              className="grid grid-cols-2 gap-2"
              role="group"
              aria-label="Format selection"
            >
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
                    aria-label={`Export as ${format.toUpperCase()}`}
                  />
                  <span className="text-sm text-gray-300 group-hover:text-gray-200 uppercase">
                    {format}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleBatchExport}
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
              aria-label="Export in selected formats"
            >
              Export Selected Formats
            </button>
          </div>
        )}

        {/* Secondary Actions */}
        <div
          className="grid grid-cols-3 gap-2 sm:gap-3"
          role="group"
          aria-label="Additional actions"
        >
          <button
            onClick={onCopyImage}
            disabled={isExporting}
            aria-label="Copy board image to clipboard"
            aria-disabled={isExporting}
            className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <Copy
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>Copy</span>
          </button>

          <button
            onClick={onAddToFavorites}
            disabled={isExporting}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            aria-pressed={isFavorite}
            aria-disabled={isExporting}
            className="group px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                isFavorite
                  ? 'fill-current scale-110'
                  : 'group-hover:scale-110 group-hover:fill-current'
              }`}
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">
              {isFavorite ? 'Remove favorites' : 'Save'}
            </span>
            <span className="sm:hidden">Saved</span>
          </button>

          <button
            onClick={onFlip}
            disabled={isExporting}
            aria-label="Flip board orientation"
            aria-disabled={isExporting}
            className="group px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 active:scale-95 rounded-lg text-xs sm:text-sm font-semibold text-gray-200 transition-all duration-200 shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <RefreshCcw
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>Flip</span>
          </button>
        </div>
      </div>
    );
  }
);

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
