import { memo, useState, useEffect, useCallback } from 'react';
import { validateFEN } from '@/utils';
import { useFENBatch } from '@/contexts';
import ClipboardHistory from '@/components/features/ClipboardHistory';
import {
  Copy,
  CheckCircle,
  Clipboard,
  AlertCircle,
  Plus,
  Heart,
  List
} from 'lucide-react';

/**
 * FEN string input field with copy, paste, batch-add, favorites, and clipboard history actions.
 * @param {Object} props
 * @param {string} props.fen - Current FEN string value
 * @param {Function} props.onChange - Called on every keystroke
 * @param {Function} [props.onBlur] - Called when the field loses focus
 * @param {string} [props.error] - Validation error message
 * @param {Function} [props.onCopy] - Copies the FEN to clipboard
 * @param {Function} [props.onPaste] - Pastes FEN from clipboard
 * @param {boolean} [props.copySuccess] - Briefly true after a successful copy
 * @param {Function} [props.onAdvancedClick] - Navigates to the advanced FEN input page
 * @param {Function} [props.onNotification] - Called with `(message, type)` to surface a toast
 * @returns {JSX.Element}
 */
const FENInputField = memo(
  ({
    fen,
    onChange,
    onBlur,
    error,
    onCopy,
    onPaste,
    copySuccess,
    onAdvancedClick,
    onNotification
  }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isClipboardOpen, setIsClipboardOpen] = useState(false);
    const { addToBatch } = useFENBatch();

    // Load favorite status from localStorage
    useEffect(() => {
      try {
        const favorites = JSON.parse(
          localStorage.getItem('favoriteFens') || '{}'
        );
        setIsFavorite(!!favorites[fen]);
      } catch {
        setIsFavorite(false);
      }
    }, [fen]);

    // Store FEN in clipboard history when copied
    const handleCopyWithHistory = useCallback(async () => {
      if (onCopy) {
        await onCopy();

        // Save to clipboard history
        if (fen && validateFEN(fen.trim())) {
          try {
            const history = JSON.parse(
              localStorage.getItem('fenClipboardHistory') || '[]'
            );

            const newEntry = {
              fen: fen.trim(),
              timestamp: Date.now()
            };

            // Add to beginning and limit to 50 items
            const updatedHistory = [
              newEntry,
              ...history.filter((item) => item.fen !== fen.trim())
            ].slice(0, 50);

            localStorage.setItem(
              'fenClipboardHistory',
              JSON.stringify(updatedHistory)
            );
          } catch (err) {
            console.error('Failed to save to clipboard history:', err);
          }
        }
      }
    }, [fen, onCopy]);

    // Handle Add to Batch - NO navigation, just add to context
    const handleAddToBatch = useCallback(() => {
      if (!fen || !fen.trim()) {
        onNotification?.('FEN is empty', 'error');
        return;
      }

      const trimmedFen = fen.trim();
      if (!validateFEN(trimmedFen)) {
        onNotification?.('Invalid FEN - cannot add to batch', 'error');
        return;
      }

      const success = addToBatch(trimmedFen);
      if (success) {
        onNotification?.('Added to batch', 'success');
      } else {
        onNotification?.('FEN already in batch', 'warning');
      }
    }, [fen, addToBatch, onNotification]);

    // Handle Favorite toggle - using Heart icon
    const handleToggleFavorite = useCallback(() => {
      if (!fen || !fen.trim()) {
        onNotification?.('FEN is empty', 'error');
        return;
      }

      const trimmedFen = fen.trim();
      if (!validateFEN(trimmedFen)) {
        onNotification?.('Invalid FEN - cannot favorite', 'error');
        return;
      }

      try {
        const favorites = JSON.parse(
          localStorage.getItem('favoriteFens') || '{}'
        );
        const newFavoriteState = !favorites[trimmedFen];

        if (newFavoriteState) {
          favorites[trimmedFen] = true;
        } else {
          delete favorites[trimmedFen];
        }

        localStorage.setItem('favoriteFens', JSON.stringify(favorites));
        setIsFavorite(newFavoriteState);
        onNotification?.(
          newFavoriteState ? 'Added to favorites' : 'Removed from favorites',
          'success'
        );
      } catch {
        onNotification?.('Failed to update favorites', 'error');
      }
    }, [fen, onNotification]);

    const handleSelectFromClipboard = useCallback(
      (selectedFen) => {
        if (onChange) {
          onChange({ target: { value: selectedFen } });
          onNotification?.('FEN loaded from clipboard history', 'success');
        }
      },
      [onChange, onNotification]
    );

    return (
      <>
        <div className="space-y-2">
          <div className="bg-surface/50 border border-border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border-b border-border">
              {/* Clipboard History Button (Icon Only) */}
              <button
                onClick={() => setIsClipboardOpen(true)}
                className="p-2 rounded-md transition-all bg-surface hover:bg-surface-hover border border-border/50 text-text-secondary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title="View clipboard history"
                aria-label="View clipboard history"
                type="button"
              >
                <List
                  className="w-3.5 h-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </button>

              {/* Paste Button */}
              <button
                onClick={onPaste}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all bg-surface hover:bg-surface-hover border border-border/50 text-text-secondary hover:text-accent text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title="Paste FEN from clipboard"
                aria-label="Paste FEN from clipboard"
                type="button"
              >
                <Clipboard
                  className="w-3.5 h-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>Paste</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopyWithHistory}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  copySuccess
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-surface hover:bg-surface-hover border border-border/50 text-text-secondary hover:text-accent'
                }`}
                title={copySuccess ? 'Copied!' : 'Copy FEN to clipboard'}
                aria-label={
                  copySuccess
                    ? 'FEN copied to clipboard'
                    : 'Copy FEN to clipboard'
                }
                type="button"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle
                      className="w-3.5 h-3.5"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy
                      className="w-3.5 h-3.5"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Add to Batch Button */}
              <button
                onClick={handleAddToBatch}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all bg-surface hover:bg-surface-hover border border-border/50 text-text-secondary hover:text-accent text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title="Add to batch (no redirect)"
                aria-label="Add to batch"
                type="button"
              >
                <Plus
                  className="w-3.5 h-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>Add</span>
              </button>

              {/* Favorite Button with Heart Icon */}
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isFavorite
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                    : 'bg-surface hover:bg-surface-hover border border-border/50 text-text-secondary hover:text-red-500'
                }`}
                title={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
                type="button"
              >
                <Heart
                  className="w-3.5 h-3.5"
                  strokeWidth={2.5}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Textarea - Reduced font size and padding */}
            <div className="relative">
              <textarea
                value={fen}
                onChange={onChange}
                onBlur={onBlur}
                aria-label="FEN notation input"
                aria-describedby={error ? 'fen-error' : undefined}
                aria-invalid={error ? 'true' : 'false'}
                className={`
                  w-full px-3 py-2
                  bg-surface/50 text-text-primary 
                  font-mono text-[12px] leading-tight resize-none min-h-[80px]
                  focus-visible:outline-none focus:outline-none outline-none 
                  transition-all border-0
                  ${error ? 'text-error' : ''}
                `}
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                spellCheck="false"
                autoComplete="off"
              />

              <button
                onClick={onAdvancedClick}
                className="absolute bottom-2 right-2 text-[12px] text-accent/80 hover:text-accent font-semibold transition-colors underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1"
                type="button"
                aria-label="Open advanced FEN input modal"
              >
                Advanced FEN Input
              </button>
            </div>
          </div>

          {error && (
            <div
              id="fen-error"
              className="flex items-center gap-2 text-red-400 text-xs mt-1"
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Clipboard History Modal */}
        <ClipboardHistory
          isOpen={isClipboardOpen}
          onClose={() => setIsClipboardOpen(false)}
          onSelectFen={handleSelectFromClipboard}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.fen === nextProps.fen &&
      prevProps.error === nextProps.error &&
      prevProps.copySuccess === nextProps.copySuccess &&
      prevProps.onBlur === nextProps.onBlur
    );
  }
);

FENInputField.displayName = 'FENInputField';

export default FENInputField;
