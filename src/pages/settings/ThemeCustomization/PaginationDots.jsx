import { memo } from 'react';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const PaginationDots = memo(function PaginationDots({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      {Array.from(
        {
          length: totalPages
        },
        (_, i) => i
      ).map((pageNum) => (
        <button
          key={`page-dot-${pageNum}`}
          onClick={() => onPageChange(pageNum)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${pageNum === currentPage ? 'bg-accent w-5' : 'bg-border hover:bg-text-muted'}`}
          aria-label={`Go to page ${pageNum + 1}`}
        />
      ))}
    </div>
  );
});
PaginationDots.displayName = 'PaginationDots';
export default PaginationDots;
