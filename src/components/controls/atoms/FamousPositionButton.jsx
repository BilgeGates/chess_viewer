import { memo } from 'react';

/**
 * Famous Position Button
 * Single button in famous positions grid
 */
const FamousPositionButton = memo(
  ({ position, onClick }) => {
    return (
      <button
        onClick={() => onClick(position.fen)}
        className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-950/50 outline-none rounded-lg text-gray-200 transition-colors duration-300 ease-in-out text-left hover:text-blue-400 hover:bg-gray-800/70 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        title={position.description}
        aria-label={`Load ${position.name} position`}
      >
        <span className="font-semibold">{position.name}</span>
      </button>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.position.fen === nextProps.position.fen;
  }
);

FamousPositionButton.displayName = 'FamousPositionButton';

export default FamousPositionButton;
