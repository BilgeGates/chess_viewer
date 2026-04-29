import { memo } from 'react';
import { createPortal } from 'react-dom';

import { useDragLayer } from 'react-dnd';

import { ItemTypes } from '@/constants';

const selectDragState = (monitor) => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getClientOffset(),
  sourceOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
});

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const CustomDragLayer = memo(function CustomDragLayer({
  pieceImages,
  boardSize = 400
}) {
  const { itemType, isDragging, item, currentOffset, sourceOffset } =
    useDragLayer(selectDragState);
  if (
    !isDragging ||
    itemType !== ItemTypes.PIECE ||
    typeof document === 'undefined'
  ) {
    return null;
  }
  const pieceImage = pieceImages[item?.pieceKey];
  if (!pieceImage) {
    return null;
  }
  const pieceSize = Math.round((boardSize / 8) * 0.85);
  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 10000,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };
  const offset = sourceOffset || currentOffset;
  if (!offset) {
    return null;
  }
  const shift = sourceOffset ? 0 : pieceSize / 2;
  const x = Math.round(offset.x - shift);
  const y = Math.round(offset.y - shift);
  const itemStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    transform: `translate3d(${x}px, ${y}px, 0)`,
    width: `${pieceSize}px`,
    height: `${pieceSize}px`,
    pointerEvents: 'none'
  };
  return createPortal(
    <div style={layerStyles} aria-hidden="true">
      <div style={itemStyles}>
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
            WebkitUserSelect: 'none'
          }}
          draggable={false}
        />
      </div>
    </div>,
    document.body
  );
});
CustomDragLayer.displayName = 'CustomDragLayer';
export default CustomDragLayer;
