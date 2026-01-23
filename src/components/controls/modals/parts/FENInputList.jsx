import { memo, useCallback } from 'react';
import { Check, Clipboard, Star, Trash2, AlertCircle } from 'lucide-react';
import { validateFEN } from '../../../../utils';

/**
 * Single FEN Input Row
 */
const FENInputRow = memo(
  ({
    index,
    fen,
    error,
    isDuplicate,
    isFavorite,
    isPasted,
    canDelete,
    onUpdate,
    onPaste,
    onToggleFavorite,
    onDelete
  }) => {
    const handleInputChange = useCallback(
      (e) => {
        onUpdate(index, e.target.value);
      },
      [index, onUpdate]
    );

    const handlePaste = useCallback(() => {
      onPaste(index);
    }, [index, onPaste]);

    const handleToggleFavorite = useCallback(() => {
      onToggleFavorite(fen);
    }, [fen, onToggleFavorite]);

    const handleDelete = useCallback(() => {
      onDelete(index);
    }, [index, onDelete]);

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 group">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 border border-gray-700">
            {index + 1}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={fen}
              onChange={handleInputChange}
              placeholder="Enter FEN notation..."
              className={`w-full px-4 py-2.5 pr-24 bg-gray-800/50 border rounded-lg text-sm text-white font-mono outline-none focus:border-blue-500 transition-colors ${
                error ? 'border-red-500' : 'border-gray-700'
              }`}
              aria-label={`FEN position ${index + 1}`}
              aria-invalid={!!error}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                onClick={handleToggleFavorite}
                disabled={!fen.trim() || !validateFEN(fen)}
                className={`p-1.5 rounded-md transition-all ${
                  isFavorite
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
                title="Toggle favorite"
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Star
                  className="w-4 h-4"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </button>
              <button
                onClick={handlePaste}
                className={`p-1.5 rounded-md transition-all ${
                  isPasted ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Paste FEN"
                aria-label="Paste FEN from clipboard"
              >
                {isPasted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Clipboard className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className="p-2 hover:bg-red-600/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
            aria-label={`Delete FEN position ${index + 1}`}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
        {error && (
          <div
            className="flex items-center gap-2 text-red-400 text-xs ml-10"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
        {isDuplicate && (
          <div
            className="flex items-center gap-2 text-yellow-400 text-xs ml-10"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>This FEN already exists in another position</span>
          </div>
        )}
      </div>
    );
  }
);

FENInputRow.displayName = 'FENInputRow';

/**
 * FEN Input List Component
 */
const FENInputList = memo(
  ({
    fens,
    maxFens,
    fenErrors,
    duplicateWarning,
    favorites,
    pastedIndex,
    onUpdateFen,
    onAddFen,
    onRemoveFen,
    onToggleFavorite,
    onPaste
  }) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">FEN Positions</h3>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400">
              {fens.length} / {maxFens} slots
            </div>
            <button
              onClick={onAddFen}
              disabled={fens.length >= maxFens}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-white text-sm font-semibold"
              aria-label="Add new FEN position"
            >
              <span>+</span>
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {fens.map((fen, index) => (
            <FENInputRow
              key={fen || `empty-slot-${index}`}
              index={index}
              fen={fen}
              error={fenErrors[index]}
              isDuplicate={duplicateWarning === index}
              isFavorite={favorites[fen]}
              isPasted={pastedIndex === index}
              canDelete={fens.length > 1}
              onUpdate={onUpdateFen}
              onPaste={onPaste}
              onToggleFavorite={onToggleFavorite}
              onDelete={onRemoveFen}
            />
          ))}
        </div>
      </div>
    );
  }
);

FENInputList.displayName = 'FENInputList';

export default FENInputList;
