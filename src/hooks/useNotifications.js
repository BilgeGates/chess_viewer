import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Toast notification system hook.
 *
 * @returns {{ notifications: Array, success: Function, error: Function, info: Function, warning: Function, removeNotification: Function }}
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef({});

  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  /**
   * Remove a notification by its ID and cancel its auto-dismiss timer.
   *
   * @param {number} id - Notification ID to remove
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  /**
   * Add a new notification to the stack.
   *
   * @param {string} message - Notification message
   * @param {'info'|'success'|'error'|'warning'} type - Notification type
   * @param {number} duration - Auto-dismiss delay in milliseconds (0 = persistent)
   */
  const addNotification = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now() + Math.random();
      const notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        timeoutRefs.current[id] = setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  /**
   * Show a success notification.
   *
   * @param {string} message - Message to display
   * @param {number} duration - Auto-dismiss delay in milliseconds
   */
  const success = useCallback(
    (message, duration = 3000) => {
      addNotification(message, 'success', duration);
    },
    [addNotification]
  );

  /**
   * Show an error notification.
   *
   * @param {string} message - Message to display
   * @param {number} duration - Auto-dismiss delay in milliseconds
   */
  const error = useCallback(
    (message, duration = 4000) => {
      addNotification(message, 'error', duration);
    },
    [addNotification]
  );

  /**
   * Show an informational notification.
   *
   * @param {string} message - Message to display
   * @param {number} duration - Auto-dismiss delay in milliseconds
   */
  const info = useCallback(
    (message, duration = 3000) => {
      addNotification(message, 'info', duration);
    },
    [addNotification]
  );

  /**
   * Show a warning notification.
   *
   * @param {string} message - Message to display
   * @param {number} duration - Auto-dismiss delay in milliseconds
   */
  const warning = useCallback(
    (message, duration = 3500) => {
      addNotification(message, 'warning', duration);
    },
    [addNotification]
  );

  return {
    notifications,
    success,
    error,
    info,
    warning,
    removeNotification
  };
};
