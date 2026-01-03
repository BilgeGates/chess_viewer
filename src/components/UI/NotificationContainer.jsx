import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const NotificationContainer = ({ notifications, onRemove }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}
      </style>
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onRemove={() => onRemove(notification.id)}
          />
        ))}
      </div>
    </>
  );
};

const Toast = React.memo(({ notification, onRemove }) => {
  const { type, message } = notification;

  const styles = {
    success: {
      bg: "bg-emerald-500/95",
      icon: <CheckCircle className="w-5 h-5" strokeWidth={2.5} />,
    },
    error: {
      bg: "bg-red-500/95",
      icon: <XCircle className="w-5 h-5" strokeWidth={2.5} />,
    },
    warning: {
      bg: "bg-amber-500/95",
      icon: <AlertCircle className="w-5 h-5" strokeWidth={2.5} />,
    },
    info: {
      bg: "bg-blue-500/95",
      icon: <Info className="w-5 h-5" strokeWidth={2.5} />,
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      onClick={onRemove}
      className={`${style.bg} text-white px-4 py-3 rounded-lg shadow-xl cursor-pointer
        flex items-center gap-3 animate-slideIn hover:scale-105 transition-transform pointer-events-auto`}
    >
      <div className="flex-shrink-0">{style.icon}</div>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
});

Toast.displayName = "Toast";

export default NotificationContainer;
