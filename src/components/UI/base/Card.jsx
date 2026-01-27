const Card = ({
  children,
  className = '',
  gradient = false,
  padding = 'p-4 sm:p-6',
  border = true
}) => {
  return (
    <div
      className={`
        ${
          gradient
            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
            : 'bg-gray-800'
        }
        rounded-xl ${padding}
        ${border ? 'border border-gray-700/50' : ''}
        shadow-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
