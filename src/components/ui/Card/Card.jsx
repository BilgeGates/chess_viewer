import { getCardClasses } from '@/utils';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
function Card({
  children,
  className = '',
  gradient = false,
  glass = false,
  padding = 'md'
}) {
  return (
    <div
      className={`overflow-hidden ${getCardClasses(gradient, glass, padding, className)}`}
    >
      {children}
    </div>
  );
}
export default Card;
