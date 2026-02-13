import { memo, useRef, useLayoutEffect } from 'react';
import { useDragLayer } from 'react-dnd';
import { ItemTypes } from '@/constants';

const CustomDragLayer = memo(({ pieceImages, boardSize = 400 }) => {
  const dragPreviewRef = useRef(null);

  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getClientOffset(),
      initialOffset: monitor.getInitialClientOffset(),
      isDragging: monitor.isDragging()
    })
  );

  // Apply will-change only during active drag for performance
  useLayoutEffect(() => {
    if (dragPreviewRef.current) {
      if (isDragging) {
        dragPreviewRef.current.style.willChange = 'transform';
      } else {
        dragPreviewRef.current.style.willChange = 'auto';
      }
    }
  }, [isDragging]);

  if (!isDragging || itemType !== ItemTypes.PIECE) {
    return null;
  }

  const pieceImage = pieceImages[item?.pieceKey];
  if (!pieceImage) {
    return null;
  }

  const SQUARE_SIZE = boardSize / 8;
  const PIECE_SIZE = Math.round(SQUARE_SIZE * 0.85);

  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 10000,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    contain: 'strict'
  };

  const getItemStyles = () => {
    if (!currentOffset) {
      return { display: 'none' };
    }

    const { x, y } = currentOffset;

    // translate3d for GPU acceleration, centered on cursor
    const halfSize = PIECE_SIZE / 2;
    const translateX = Math.round(x - halfSize);
    const translateY = Math.round(y - halfSize);

    return {
      position: 'fixed',
      left: 0,
      top: 0,
      transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
      WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0)`,
      width: `${PIECE_SIZE}px`,
      height: `${PIECE_SIZE}px`,
      pointerEvents: 'none',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden'
    };
  };

  return (
    <div style={layerStyles} aria-hidden="true">
      <div ref={dragPreviewRef} style={getItemStyles()}>
        <img
          src={pieceImage.src}
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.95,
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            imageRendering: 'auto'
          }}
          draggable={false}
        />
      </div>
    </div>
  );
});

CustomDragLayer.displayName = 'CustomDragLayer';

export default CustomDragLayer;
