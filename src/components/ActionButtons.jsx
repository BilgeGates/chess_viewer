const ActionButtons = ({
  onDownloadPNG,
  onDownloadJPEG,
  onCopyImage,
  onFlip,
  onCopyFEN,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
      <button
        onClick={onDownloadPNG}
        className="group px-5 py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-95 rounded-lg text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4 group-hover:scale-110 transition-transform"
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
        className="group px-5 py-3.5 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 rounded-lg text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-amber-500/50 flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4 group-hover:scale-110 transition-transform"
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
        onClick={onCopyImage}
        className="group px-5 py-3.5 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 active:scale-95 rounded-lg text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4 group-hover:scale-110 transition-transform"
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
        className="group px-5 py-3.5 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 active:scale-95 rounded-lg text-sm font-semibold text-gray-200 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
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
        <span>Flip Board</span>
      </button>

      <button
        onClick={onCopyFEN}
        className="group px-5 py-3.5 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 active:scale-95 rounded-lg text-sm font-semibold text-gray-200 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 col-span-2"
      >
        <svg
          className="w-4 h-4 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Copy FEN</span>
      </button>
    </div>
  );
};

export default ActionButtons;
