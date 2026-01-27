import { memo } from 'react';
import { Copy, CheckCircle, Clipboard, AlertCircle } from 'lucide-react';

/**
 * FEN Input Textarea
 * Separated from parent for better performance
 */
const FENInputField = memo(
  ({ fen, onChange, error, onCopy, onPaste, copySuccess, onAdvancedClick }) => {
    return (
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={fen}
            onChange={onChange}
            className={`
            w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 
            bg-gray-950/50 rounded-lg text-xs sm:text-sm text-gray-200 
            font-mono resize-none min-h-[80px] sm:min-h-[90px] 
            focus-visible:outline-none focus:outline-none outline-none 
            focus:ring-0 transition-all
            ${error ? 'border border-red-500' : ''}
          `}
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />

          {/* Advanced Button - Bottom Right */}
          <button
            onClick={onAdvancedClick}
            className="absolute bottom-2 right-2 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors underline-offset-2 hover:underline"
          >
            Advanced FEN Input
          </button>

          {/* Action Buttons - Top Right */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={onPaste}
              className="p-1.5 sm:p-2 rounded-md text-white transition-all bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
              title="Paste FEN"
            >
              <Clipboard className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={onCopy}
              className={`p-1.5 sm:p-2 rounded-md text-white transition-all ${
                copySuccess
                  ? 'bg-green-600'
                  : 'bg-blue-600/90 hover:bg-blue-500'
              }`}
              title="Copy FEN"
            >
              {copySuccess ? (
                <CheckCircle
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  strokeWidth={2.5}
                />
              ) : (
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
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
      prevProps.copySuccess === nextProps.copySuccess
    );
  }
);

FENInputField.displayName = 'FENInputField';

export default FENInputField;
