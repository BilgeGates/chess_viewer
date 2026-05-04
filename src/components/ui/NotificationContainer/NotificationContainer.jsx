import { memo } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
function NotificationContainer({ notifications, onRemove }) {
  if (!notifications || notifications.length === 0) return null;
  return (
    <div
      className="fixed top-24 right-4 z-[90] flex flex-col gap-3 max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onRemove={() => onRemove(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const Toast = memo(function Toast({ notification, onRemove }) {
  const { type, message } = notification;
  const styles = {
    success: {
      gradient: 'from-success/90 to-success',
      icon: (
        <CheckCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
      ),
      label: 'Success notification',
      shadow: 'shadow-success/30'
    },
    error: {
      gradient: 'from-error/90 to-error',
      icon: (
        <XCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
      ),
      label: 'Error notification',
      shadow: 'shadow-error/30'
    },
    warning: {
      gradient: 'from-warning/90 to-warning',
      icon: (
        <AlertCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
      ),
      label: 'Warning notification',
      shadow: 'shadow-warning/30'
    },
    info: {
      gradient: 'from-info/90 to-info',
      icon: <Info className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />,
      label: 'Information notification',
      shadow: 'shadow-info/30'
    }
  };
  const style = styles[type] || styles.info;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.99 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.99 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      role="alert"
      aria-label={style.label}
      tabIndex={0}
      className={`group relative pointer-events-auto glass-card bg-gradient-to-r ${style.gradient} text-white px-5 py-4 rounded-xl shadow-xl ${style.shadow}
        flex items-center gap-4 transition-shadow duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        {style.icon}
      </div>

      <p className="text-sm font-semibold flex-1 leading-relaxed">{message}</p>

      <button
        onClick={onRemove}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRemove();
          }
        }}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-white/40"
          style={{
            animation: 'shrinkProgress 4s linear forwards',
            transformOrigin: 'left center'
          }}
        />
      </div>
    </motion.div>
  );
});
Toast.displayName = 'Toast';
export default NotificationContainer;
