import React, { useEffect, useRef, useCallback } from 'react';
import { useScrollLock } from '@/hooks';
import { X } from 'lucide-react';

const Modal = React.memo(
  ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    iconColor = 'text-accent',
    children,
    maxWidth = 'max-w-lg',
    showCloseButton = true,
    disableScrollLock = false,
    disableBackdropClick = false
  }) => {
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    useScrollLock(isOpen && !disableScrollLock);

    const handleBackdropClick = useCallback(() => {
      if (!disableBackdropClick) {
        onClose();
      }
    }, [onClose, disableBackdropClick]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key !== 'Tab') return;

        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement;

        setTimeout(() => {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }, 50);

        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          if (
            previousActiveElement.current &&
            document.body.contains(previousActiveElement.current)
          ) {
            previousActiveElement.current.focus();
          }
        };
      }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-[9998] bg-black/60"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className={`relative ${maxWidth} w-full bg-surface border border-border rounded-2xl shadow-xl animate-fadeInScale`}
            style={{
              maxHeight: 'calc(100vh - 2rem)',
              overflowY: 'auto',
              pointerEvents: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 border-b border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                {Icon && (
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`}
                    aria-hidden="true"
                  />
                )}
                <h3
                  id="modal-title"
                  className="text-base sm:text-lg font-semibold text-text-primary"
                >
                  {title}
                </h3>
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-surface-hover transition-colors"
                  aria-label="Close modal"
                >
                  <X
                    className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted hover:text-text-primary transition-colors"
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>

            <div className="px-5 sm:px-6 py-4 sm:py-5">{children}</div>
          </div>
        </div>
      </>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
