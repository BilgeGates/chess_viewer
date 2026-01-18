import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Toast notification system
 * @returns {Object} Notification methods
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

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

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

  const success = useCallback(
    (message, duration = 3000) => {
      addNotification(message, 'success', duration);
    },
    [addNotification]
  );

  const error = useCallback(
    (message, duration = 4000) => {
      addNotification(message, 'error', duration);
    },
    [addNotification]
  );

  const info = useCallback(
    (message, duration = 3000) => {
      addNotification(message, 'info', duration);
    },
    [addNotification]
  );

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
