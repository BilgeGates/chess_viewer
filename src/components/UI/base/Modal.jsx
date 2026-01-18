import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const Modal = React.memo(
  ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    iconColor = 'text-blue-400',
    children,
    maxWidth = 'max-w-xl',
    showCloseButton = true
  }) => {
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Focus trap implementation
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key !== 'Tab') return;

        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      },
      [onClose]
    );

    // Focus management
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement;

        // Focus first focusable element
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          focusableElements[0].focus();
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          // Restore focus on close
          previousActiveElement.current?.focus();
        };
      }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon className={`w-6 h-6 ${iconColor}`} aria-hidden="true" />
              )}
              <h3 id="modal-title" className="text-xl font-bold text-white">
                {title}
              </h3>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
