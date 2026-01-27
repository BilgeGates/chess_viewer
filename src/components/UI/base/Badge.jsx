const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-700 text-gray-300',
    primary: 'bg-blue-600/20 text-blue-400 border border-blue-500/50',
    success: 'bg-green-600/20 text-green-400 border border-green-500/50',
    warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/50',
    danger: 'bg-red-600/20 text-red-400 border border-red-500/50',
    purple: 'bg-purple-600/20 text-purple-400 border border-purple-500/50'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-semibold
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
