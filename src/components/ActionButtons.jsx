const ActionButtons = ({
  onDownloadPNG,
  onDownloadJPEG,
  onCopyImage,
  onFlip,
  onCopyFEN,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
      <button
        onClick={onDownloadPNG}
        className="px-5 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 border border-blue-500 rounded-lg text-sm font-medium text-white transition-all duration-150 flex items-center justify-center gap-2"
      >
        <i className="fas fa-download"></i>
        <span>PNG</span>
      </button>

      <button
        onClick={onDownloadJPEG}
        className="px-5 py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 border border-amber-500 rounded-lg text-sm font-medium text-white transition-all duration-150 flex items-center justify-center gap-2"
      >
        <i className="fas fa-download"></i>
        <span>JPEG</span>
      </button>

      <button
        onClick={onCopyImage}
        className="px-5 py-3 bg-green-600 hover:bg-green-500 active:scale-95 border border-green-500 rounded-lg text-sm font-medium text-white transition-all duration-150 flex items-center justify-center gap-2"
      >
        <i className="fas fa-copy"></i>
        <span>Kopyala</span>
      </button>

      <button
        onClick={onFlip}
        className="px-5 py-3 bg-gray-700 hover:bg-gray-600 active:scale-95 border border-gray-600 rounded-lg text-sm font-medium text-gray-200 transition-all duration-150 flex items-center justify-center gap-2"
      >
        <i className="fas fa-rotate"></i>
        <span>Çevir</span>
      </button>

      <button
        onClick={onCopyFEN}
        className="px-5 py-3 bg-gray-700 hover:bg-gray-600 active:scale-95 border border-gray-600 rounded-lg text-sm font-medium text-gray-200 transition-all duration-150 flex items-center justify-center gap-2 col-span-2"
      >
        <i className="fas fa-clipboard"></i>
        <span>FEN Kopyala</span>
      </button>
    </div>
  );
};

export default ActionButtons;
