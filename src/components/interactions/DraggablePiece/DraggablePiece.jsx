import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ItemTypes, getPieceImageKey } from '@/constants';

const DraggablePiece = memo(
  ({
    piece,
    pieceImage,
    row,
    col,
    isFromPalette = false,
    size = '85%',
    disabled = false
  }) => {
    const pieceRef = useRef(null);
    const pieceKey = getPieceImageKey(piece);

    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: ItemTypes.PIECE,
        item: () => ({
          piece,
          pieceKey,
          fromRow: row,
          fromCol: col,
          isFromPalette
        }),
        canDrag: () => !disabled && !!piece,
        collect: (monitor) => ({
          isDragging: monitor.isDragging()
        })
      }),
      [piece, pieceKey, row, col, isFromPalette, disabled]
    );

    // Disable browser's default drag image to prevent ghost/duplicate
    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    useLayoutEffect(() => {
      if (pieceRef.current) {
        if (isDragging) {
          pieceRef.current.style.willChange = 'opacity, transform';
        } else {
          pieceRef.current.style.willChange = 'auto';
        }
      }
    }, [isDragging]);

    if (!piece || !pieceImage) return null;

    return (
      <div
        ref={(node) => {
          drag(node);
          pieceRef.current = node;
        }}
        className={`
          flex items-center justify-center
          select-none touch-none
          ${disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
        `}
        style={{
          width: size,
          height: size,
          // Hide during drag to prevent ghost on original square
          opacity: isDragging ? 0 : disabled ? 0.5 : 1,
          transition: isDragging ? 'none' : 'opacity 50ms ease-out',
          zIndex: isDragging ? -1 : 1,
          contain: 'layout style'
        }}
        role="button"
        aria-label={`Drag ${piece}`}
        aria-grabbed={isDragging}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
      >
        <img
          src={pieceImage.src}
          alt={piece}
          className="w-full h-full object-contain"
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
          draggable={false}
        />
      </div>
    );
  }
);

DraggablePiece.displayName = 'DraggablePiece';

export default DraggablePiece;
