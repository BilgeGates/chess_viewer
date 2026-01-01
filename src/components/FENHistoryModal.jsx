import React from "react";
import { History, Clock, Trash2, X, Heart } from "lucide-react";
import MiniChessPreview from "./MiniChessPreview";

const FENHistoryModal = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClear,
  onToggleFavorite,
  lightSquare,
  darkSquare,
  pieceStyle,
}) => {
  const [hoveredFen, setHoveredFen] = React.useState(null);
  const [filter, setFilter] = React.useState("all");

  if (!isOpen) return null;

  const filteredHistory =
    filter === "favorites"
      ? history.filter((item) => item.isFavorite)
      : history;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              FEN History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Filter Tabs */}
        {history.length > 0 && (
          <div className="flex gap-2 px-4 sm:px-6 pt-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilter("favorites")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === "favorites"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Favorites ({history.filter((h) => h.isFavorite).length})
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex gap-4 p-4 sm:p-6">
          {/* History List */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Clock className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {filter === "favorites"
                    ? "No favorites yet"
                    : "No history yet"}
                </p>
                <p className="text-sm">
                  {filter === "favorites"
                    ? "Star positions to see them here"
                    : "Set up positions to see them here"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-gray-950/50 rounded-lg p-4 border border-gray-700/30 hover:border-blue-500/50 transition-all cursor-pointer"
                    onClick={() => onSelect(item.fen)}
                    onMouseEnter={() => setHoveredFen(item.fen)}
                    onMouseLeave={() => setHoveredFen(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-400">
                            {new Date(item.timestamp).toLocaleString("az-AZ", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {item.isFavorite && (
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          )}
                        </div>
                        <div className="font-mono text-xs sm:text-sm text-gray-300 break-all">
                          {item.fen}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            item.isFavorite
                              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              : "hover:bg-gray-700/50 text-gray-400"
                          }`}
                          title={
                            item.isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={item.isFavorite ? "currentColor" : "none"}
                            strokeWidth={2}
                          />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:block w-48 flex-shrink-0">
            <div className="sticky top-0 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Preview
              </h3>
              {hoveredFen ? (
                <MiniChessPreview
                  fen={hoveredFen}
                  lightSquare={lightSquare}
                  darkSquare={darkSquare}
                  pieceStyle={pieceStyle}
                />
              ) : (
                <div className="w-40 h-40 rounded border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs text-center">
                  Hover over a position to preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-gray-700/50">
            <button
              onClick={onClear}
              className="w-full px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 font-semibold transition-all"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(26, 26, 36, 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
        }
      `,
        }}
      />
    </div>
  );
};

export default FENHistoryModal;
