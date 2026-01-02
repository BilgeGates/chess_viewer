const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    success: "bg-green-600 hover:bg-green-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    outline: "bg-transparent hover:bg-gray-800 text-gray-300",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300",
    gradient:
      "bg-gradient-to-br from-blue-600/20 to-purple-600/20 text-blue-300 hover:text-blue-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        rounded-lg font-semibold transition-all
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
