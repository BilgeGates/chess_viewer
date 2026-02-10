import { memo } from 'react';
import { Copy, CheckCircle, Clipboard, AlertCircle } from 'lucide-react';

const FENInputField = memo(
  ({
    fen,
    onChange,
    onBlur,
    error,
    onCopy,
    onPaste,
    copySuccess,
    onAdvancedClick
  }) => {
    return (
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={fen}
            onChange={onChange}
            onBlur={onBlur}
            aria-label="FEN notation input"
            aria-describedby={error ? 'fen-error' : undefined}
            aria-invalid={error ? 'true' : 'false'}
            className={`
              w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 
              bg-surface/50 rounded-lg text-xs sm:text-sm text-text-primary 
              font-mono resize-none min-h-[80px] sm:min-h-[90px] 
              focus-visible:outline-none focus:outline-none outline-none 
              focus:ring-2 focus:ring-accent/50 transition-all border
              ${error ? 'border-error' : 'border-border hover:border-border'}
            `}
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            spellCheck="false"
            autoComplete="off"
          />

          <button
            onClick={onAdvancedClick}
            className="absolute bottom-2 right-2 text-xs text-accent/80 hover:text-accent font-semibold transition-colors underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded px-1"
            type="button"
            aria-label="Open advanced FEN input modal"
          >
            Advanced FEN Input
          </button>

          <div
            className="absolute top-2 right-2 flex gap-1"
            role="group"
            aria-label="FEN actions"
          >
            <button
              onClick={onPaste}
              className="p-1.5 sm:p-2 rounded-md transition-all bg-surface-elevated hover:bg-surface-hover border border-border/50 text-text-secondary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              title="Paste FEN from clipboard"
              aria-label="Paste FEN from clipboard"
              type="button"
            >
              <Clipboard
                className="w-3 h-3 sm:w-4 sm:h-4"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </button>
            <button
              onClick={onCopy}
              className={`p-1.5 sm:p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                copySuccess
                  ? 'bg-success/20 text-success border border-success/30'
                  : 'bg-surface-elevated hover:bg-surface-hover border border-border/50 text-text-secondary hover:text-accent'
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
                <CheckCircle
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              ) : (
                <Copy
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
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
