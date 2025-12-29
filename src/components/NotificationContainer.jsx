import { useState, useEffect } from "react";
import { Check, X, AlertTriangle, Info } from "lucide-react";

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div className="flex flex-col items-center gap-2">
        {notifications.map((notification) => (
          <DynamicIsland
            key={notification.id}
            notification={notification}
            onRemove={() => onRemove(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

const DynamicIsland = ({ notification, onRemove }) => {
  const [phase, setPhase] = useState("compact");

  useEffect(() => {
    // Compact -> Expanding -> Expanded -> Collapsing -> Compact -> Remove
    const timeline = [
      { phase: "compact", duration: 100 },
      { phase: "expanding", duration: 300 },
      { phase: "expanded", duration: notification.duration - 800 },
      { phase: "collapsing", duration: 300 },
      { phase: "compact", duration: 100 },
    ];

    let currentIndex = 0;
    let timeoutId;

    const runTimeline = () => {
      if (currentIndex >= timeline.length) {
        onRemove();
        return;
      }

      const current = timeline[currentIndex];
      setPhase(current.phase);

      timeoutId = setTimeout(() => {
        currentIndex++;
        runTimeline();
      }, current.duration);
    };

    runTimeline();

    return () => clearTimeout(timeoutId);
  }, [notification.duration, onRemove]);

  const getPhaseStyles = () => {
    switch (phase) {
      case "compact":
        return "w-28 h-9 rounded-full";
      case "expanding":
        return "w-80 h-14 rounded-3xl";
      case "expanded":
        return "w-80 h-14 rounded-3xl";
      case "collapsing":
        return "w-28 h-9 rounded-full";
      default:
        return "w-28 h-9 rounded-full";
    }
  };

  const typeColors = {
    success: "bg-gradient-to-r from-emerald-500 to-green-600",
    error: "bg-gradient-to-r from-red-500 to-rose-600",
    warning: "bg-gradient-to-r from-amber-500 to-orange-600",
    info: "bg-gradient-to-r from-blue-500 to-cyan-600",
  };

  const icons = {
    success: <Check className="w-4 h-4" strokeWidth={3} />,
    error: <X className="w-4 h-4" strokeWidth={3} />,
    warning: <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />,
    info: <Info className="w-4 h-4" strokeWidth={2.5} />,
  };

  const showContent = phase === "expanded" || phase === "expanding";

  return (
    <div
      className={`
        ${getPhaseStyles()}
        ${typeColors[notification.type]}
        flex items-center justify-center gap-3 px-4
        transition-all duration-300 ease-in-out
        shadow-2xl
        pointer-events-auto cursor-pointer
        hover:scale-105 active:scale-95
        backdrop-blur-xl
      `}
      style={{
        boxShadow:
          "0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      }}
      onClick={onRemove}
    >
      {/* Icon */}
      <div className="text-white flex-shrink-0 flex items-center justify-center">
        {icons[notification.type]}
      </div>

      {/* Message */}
      {showContent && (
        <div className="flex-1 overflow-hidden">
          <p className="text-white text-sm font-semibold tracking-tight truncate">
            {notification.message}
          </p>
        </div>
      )}

      {/* Glow effect */}
      {phase === "expanded" && (
        <div
          className="absolute inset-0 rounded-3xl opacity-30 blur-xl"
          style={{
            background:
              notification.type === "success"
                ? "rgba(16, 185, 129, 0.5)"
                : notification.type === "error"
                ? "rgba(239, 68, 68, 0.5)"
                : notification.type === "warning"
                ? "rgba(245, 158, 11, 0.5)"
                : "rgba(59, 130, 246, 0.5)",
          }}
        />
      )}
    </div>
  );
};

export default NotificationContainer;
