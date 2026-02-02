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
            className="group relative overflow-hidden px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-95 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg hover:shadow-blue-500/50"
          >
            <Download
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
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
            className="group relative overflow-hidden px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-95 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg hover:shadow-amber-500/50"
          >
            <Download
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
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
            className="group relative overflow-hidden px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg hover:shadow-purple-500/50"
          >
            <Image
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>Batch</span>
          </button>
        </div>

        {/* Batch Export Menu */}
        {showBatchMenu && (
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500/30 rounded-xl p-4 space-y-4 animate-fadeIn shadow-xl"
            role="region"
            aria-label="Batch export options"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Image className="w-4 h-4 text-purple-400" />
              <span>Select Export Formats</span>
            </div>
            <div
              className="grid grid-cols-2 gap-3"
              role="group"
              aria-label="Format selection"
            >
              {Object.keys(selectedFormats).map((format) => (
                <label
                  key={format}
                  className="flex items-center gap-2 cursor-pointer group bg-gray-800/50 hover:bg-gray-700/50 px-4 py-3 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedFormats[format]}
                    onChange={() => toggleFormat(format)}
                    className="w-4 h-4 cursor-pointer accent-purple-500"
                    aria-label={`Export as ${format.toUpperCase()}`}
                  />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-white uppercase">
                    {format}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleBatchExport}
              className="w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:shadow-purple-500/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
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
            className="group relative overflow-hidden px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg hover:shadow-emerald-500/50"
          >
            <Copy
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
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
            className="group relative overflow-hidden px-3 sm:px-5 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg hover:shadow-rose-500/50"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                isFavorite
                  ? 'fill-current scale-110'
                  : 'group-hover:scale-110 group-hover:fill-current'
              }`}
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">
              {isFavorite ? 'Saved' : 'Save'}
            </span>
            <span className="sm:hidden">{isFavorite ? '★' : '☆'}</span>
          </button>

          <button
            onClick={onFlip}
            disabled={isExporting}
            aria-label="Flip board orientation"
            aria-disabled={isExporting}
            className="group relative overflow-hidden px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-slate-600 to-gray-700 hover:from-slate-500 hover:to-gray-600 active:scale-95 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-slate-500/50 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <RefreshCcw
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500"
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
