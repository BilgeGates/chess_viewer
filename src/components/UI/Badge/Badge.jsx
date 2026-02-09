const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-surface-hover text-text-secondary',
    primary: 'bg-accent/10 text-accent border border-accent/30',
    success: 'bg-success/10 text-success border border-success/30',
    warning: 'bg-warning/10 text-warning border border-warning/30',
    danger: 'bg-error/10 text-error border border-error/30',
    purple:
      'bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/30'
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
