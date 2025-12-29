import { useState } from "react";

/**
 * Toast notification system
 * @returns {Object} Notification methods
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const success = (message, duration = 3000) =>
    addNotification(message, "success", duration);

  const error = (message, duration = 4000) =>
    addNotification(message, "error", duration);

  const info = (message, duration = 3000) =>
    addNotification(message, "info", duration);

  const warning = (message, duration = 3500) =>
    addNotification(message, "warning", duration);

  return {
    notifications,
    success,
    error,
    info,
    warning,
    removeNotification,
  };
};
