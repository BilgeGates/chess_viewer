import React from "react";
import { X } from "lucide-react";

const Modal = React.memo(
  ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    iconColor = "text-blue-400",
    children,
    maxWidth = "max-w-xl",
    showCloseButton = true,
  }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
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

Modal.displayName = "Modal";

export default Modal;
