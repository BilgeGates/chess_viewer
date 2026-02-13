import { memo, useState, useEffect } from 'react';
import { X, Copy, Trash2, Check } from 'lucide-react';

const ClipboardHistory = memo(({ isOpen, onClose, onSelectFen }) => {
  const [clipboardHistory, setClipboardHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('fenClipboardHistory');
      const history = saved ? JSON.parse(saved) : [];
      setClipboardHistory(history);
    } catch {
      setClipboardHistory([]);
    }
  };

  const handleCopy = async (fen, index) => {
    try {
      await navigator.clipboard.writeText(fen);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRemove = (index) => {
    const updated = clipboardHistory.filter((_, i) => i !== index);
    setClipboardHistory(updated);
    localStorage.setItem('fenClipboardHistory', JSON.stringify(updated));
  };

  const handleSelect = (fen) => {
    if (onSelectFen) {
      onSelectFen(fen);
      onClose();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all clipboard history?')) {
      setClipboardHistory([]);
      localStorage.removeItem('fenClipboardHistory');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-xl font-display font-bold text-text-primary">
                Clipboard History
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Previously copied FEN positions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
              aria-label="Close clipboard history"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {clipboardHistory.length === 0 ? (
              <div className="text-center py-12">
                <Copy className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No clipboard history yet</p>
                <p className="text-text-muted text-sm mt-2">
                  Copy FEN positions to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clipboardHistory.map((item, index) => (
                  <div
                    key={`${item.fen}-${item.timestamp}`}
                    className="bg-bg border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs text-text-primary break-all mb-2">
                          {item.fen}
                        </div>
                        <div className="text-xs text-text-muted">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleSelect(item.fen)}
                          className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-bg rounded-lg text-xs font-medium transition-colors"
                          title="Use this FEN"
                        >
                          Use
                        </button>

                        <button
                          onClick={() => handleCopy(item.fen, index)}
                          className={`p-2 rounded-lg transition-colors ${
                            copiedIndex === index
                              ? 'bg-success/20 text-success'
                              : 'bg-surface-elevated hover:bg-surface-hover text-text-secondary'
                          }`}
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleRemove(index)}
                          className="p-2 rounded-lg bg-surface-elevated hover:bg-error/10 hover:text-error text-text-secondary transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {clipboardHistory.length > 0 && (
            <div className="px-6 py-4 border-t border-border">
              <button
                onClick={handleClearAll}
                className="text-sm text-error hover:text-error/80 font-medium transition-colors"
              >
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
});

ClipboardHistory.displayName = 'ClipboardHistory';

export default ClipboardHistory;
