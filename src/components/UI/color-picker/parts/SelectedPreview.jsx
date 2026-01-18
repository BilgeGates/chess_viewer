import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Check, Copy, CheckCheck } from 'lucide-react';

const SelectedPreview = React.memo(
  ({ tempColor, getRgbValues, onCopy, onApply }) => {
    const [copied, setCopied] = useState(false);
    const [applied, setApplied] = useState(false);
    const copyTimeoutRef = useRef(null);
    const applyTimeoutRef = useRef(null);

    useEffect(() => {
      return () => {
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        if (applyTimeoutRef.current) clearTimeout(applyTimeoutRef.current);
      };
    }, []);

    const handleCopy = useCallback(() => {
      onCopy();
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }, [onCopy]);

    const handleApply = useCallback(() => {
      onApply();
      setApplied(true);
      if (applyTimeoutRef.current) clearTimeout(applyTimeoutRef.current);
      applyTimeoutRef.current = setTimeout(() => setApplied(false), 1000);
    }, [onApply]);

    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-gray-700 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 shadow-2xl">
        <div
          className="absolute inset-0 opacity-10 blur-3xl transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${tempColor}, transparent 70%)`
          }}
        />

        <div className="relative flex items-center gap-4 p-5">
          {/* Color Preview */}
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-2xl border-3 border-gray-700 shadow-2xl transition-all duration-300 group-hover:scale-105"
              style={{
                background: tempColor,
                boxShadow: `0 10px 40px ${tempColor}40, 0 0 0 1px ${tempColor}20`
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl animate-pulse-ring"
              style={{
                boxShadow: `0 0 0 4px ${tempColor}20`,
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          {/* Color Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Selected Color
            </div>
            <div className="text-lg font-bold font-mono text-white mb-1 tracking-wide">
              {tempColor.toUpperCase()}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 font-mono transition-all group outline-none"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>RGB: {getRgbValues()}</span>
                </>
              )}
            </button>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={applied}
            className="relative px-6 py-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-green-600 disabled:to-green-700 text-white font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl outline-none group overflow-hidden"
            style={{
              boxShadow: applied
                ? '0 10px 40px rgba(34, 197, 94, 0.4)'
                : '0 10px 40px rgba(59, 130, 246, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <div className="relative flex items-center gap-2">
              {applied ? (
                <>
                  <CheckCheck className="w-5 h-5 animate-bounce" />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Apply</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Bottom Accent Bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(to right, ${tempColor}00, ${tempColor}, ${tempColor}00)`
          }}
        />

        <style>{`
          @keyframes pulse-ring {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.tempColor === nextProps.tempColor &&
      prevProps.getRgbValues === nextProps.getRgbValues
    );
  }
);

SelectedPreview.displayName = 'SelectedPreview';

export default SelectedPreview;
