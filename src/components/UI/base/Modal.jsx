import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { classNames } from '../../../utils';

const Modal = React.memo(
  ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    iconColor = 'text-primary-400',
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
        className={classNames.modal.overlay}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          className={`${classNames.modal.container} ${maxWidth}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={classNames.modal.header}>
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon className={`w-6 h-6 ${iconColor}`} aria-hidden="true" />
              )}
              <h3 id="modal-title" className={classNames.text.heading.h3}>
                {title}
              </h3>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700 transition-smooth-fast"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className={classNames.modal.content}>{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
