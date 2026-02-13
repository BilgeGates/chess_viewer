import { memo } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '@/constants';

const TrashZone = memo(({ onDrop, className = '', minimal = false }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      drop: (item) => {
        if (
          !item.isFromPalette &&
          item.fromRow !== undefined &&
          item.fromCol !== undefined
        ) {
          if (onDrop) {
            onDrop(item.fromRow, item.fromCol);
          }
        }
      },
      canDrop: (item) => !item.isFromPalette,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [onDrop]
  );

  if (minimal) {
    return (
      <div
        ref={drop}
        className={`
          transition-all duration-200
          ${
            isOver && canDrop
              ? 'bg-red-500/20 border-red-500'
              : canDrop
                ? 'bg-surface-secondary/50 border-border/50'
                : 'bg-transparent border-transparent'
          }
          ${className}
        `}
      />
    );
  }

  return (
    <div
      ref={drop}
      className={`
        flex items-center justify-center gap-2 px-5 py-2.5
        rounded-lg border-2 border-dashed
        transition-all duration-200
        ${
          isOver && canDrop
            ? 'bg-red-500/30 border-red-500 text-red-400 shadow-lg shadow-red-500/30 scale-105'
            : canDrop
              ? 'bg-surface-secondary/50 border-orange-500/40 hover:border-orange-500/60 text-text-muted hover:text-orange-400'
              : 'bg-surface-secondary/30 border-border/30 text-text-muted'
        }
        ${className}
      `}
      role="button"
      aria-label="Drop here to remove piece"
    >
      <svg
        className={`w-5 h-5 transition-colors duration-200`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      <span className={`text-sm font-semibold transition-colors duration-200`}>
        {isOver && canDrop ? 'Release to remove' : 'Drop to remove'}
      </span>
    </div>
  );
});

TrashZone.displayName = 'TrashZone';

export default TrashZone;
