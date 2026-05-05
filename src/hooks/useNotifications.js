import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Manages a stack of in-app notifications with auto-dismiss support.
 *
 * @returns {{ notifications: Array, notify: function, dismiss: function, clear: function }}
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef({});
  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);
  const addNotification = useCallback(
    (message, type = 'info', duration = 5000) => {
      // Clear existing notifications to ensure max 1
      setNotifications([]);
      Object.values(timeoutRefs.current).forEach(clearTimeout);
      timeoutRefs.current = {};

      const id = Date.now() + Math.random();
      const notification = {
        id,
        message,
        type,
        duration
      };
      setNotifications([notification]);
      if (duration > 0) {
        timeoutRefs.current[id] = setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );
  const success = useCallback(
    (message, duration = 5000) => {
      addNotification(message, 'success', duration);
    },
    [addNotification]
  );
  const error = useCallback(
    (message, duration = 5000) => {
      addNotification(message, 'error', duration);
    },
    [addNotification]
  );
  const info = useCallback(
    (message, duration = 5000) => {
      addNotification(message, 'info', duration);
    },
    [addNotification]
  );
  const warning = useCallback(
    (message, duration = 5000) => {
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
}
