import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const NotificationContainer = ({ notifications, onRemove }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
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

const Toast = React.memo(({ notification, onRemove }) => {
  const { type, message } = notification;

  const styles = {
    success: {
      bg: 'bg-emerald-500/95',
      icon: (
        <CheckCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
      ),
      label: 'Success notification'
    },
    error: {
      bg: 'bg-red-500/95',
      icon: (
        <XCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
      ),
      label: 'Error notification'
    },
    warning: {
      bg: 'bg-amber-500/95',
      icon: (
        <AlertCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
      ),
      label: 'Warning notification'
    },
    info: {
      bg: 'bg-blue-500/95',
      icon: <Info className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />,
      label: 'Information notification'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div
      onClick={onRemove}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRemove();
        }
      }}
      role="alert"
      aria-label={style.label}
      tabIndex={0}
      className={`${style.bg} text-white px-4 py-3 rounded-lg shadow-xl cursor-pointer
        flex items-center gap-3 animate-slideIn hover:scale-105 transition-transform 
        pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
    >
      <div className="flex-shrink-0">{style.icon}</div>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
});

Toast.displayName = 'Toast';

export default NotificationContainer;
