import { memo } from 'react';
import { Circle, Zap, AlertCircle } from 'lucide-react';
import { calculateStatus } from '@/utils/historyUtils';

/**
 * @param {Object} props
 * @param {number} props.lastActiveAt - Last active timestamp
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const StatusBadge = memo(({ lastActiveAt, className = '' }) => {
  const status = calculateStatus(lastActiveAt);

  const statusConfig = {
    green: {
      bg: 'bg-green-500/15',
      text: 'text-green-600 dark:text-green-400',
      label: 'Fresh',
      icon: Circle,
      iconClass: 'fill-green-500'
    },
    yellow: {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-600 dark:text-yellow-400',
      label: 'Aging',
      icon: Zap,
      iconClass: ''
    },
    red: {
      bg: 'bg-red-500/15',
      text: 'text-red-600 dark:text-red-400',
      label: 'Stale',
      icon: AlertCircle,
      iconClass: ''
    }
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] sm:text-xs font-semibold ${config.bg} ${config.text} ${className}`}
      title={config.label}
    >
      <IconComponent className={`w-3 h-3 ${config.iconClass}`} />
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
