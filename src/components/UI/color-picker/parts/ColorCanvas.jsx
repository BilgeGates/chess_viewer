const ColorCanvas = ({ canvasRef, onClick }) => {
  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={348}
        height={200}
        onClick={onClick}
        className="w-full rounded-xl cursor-crosshair border-2 border-gray-700/50 hover:border-blue-500/50 transition-all shadow-lg"
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-semibold">
          Click to pick
        </div>
      </div>
    </div>
  );
};

export default ColorCanvas;
