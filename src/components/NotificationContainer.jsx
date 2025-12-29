import React, { useState, useEffect } from "react";

export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onRemove, 300);
      }, notification.duration - 300);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, onRemove]);

  const typeStyles = {
    success: "bg-green-600 border-green-500",
    error: "bg-red-600 border-red-500",
    warning: "bg-amber-600 border-amber-500",
    info: "bg-blue-600 border-blue-500",
  };

  const icons = {
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`
        ${typeStyles[notification.type]}
        border-l-4 px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3 min-w-[300px] max-w-md
        transform transition-all duration-300 ease-out
        ${
          isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }
      `}
    >
      <div className="text-white">{icons[notification.type]}</div>
      <div className="flex-1 text-white text-sm font-medium">
        {notification.message}
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onRemove, 300);
        }}
        className="text-white/80 hover:text-white transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
