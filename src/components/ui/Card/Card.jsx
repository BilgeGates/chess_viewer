import { getCardClasses } from '@/utils';

/**
 * Generic surface card wrapper.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className=''] - Additional Tailwind classes
 * @param {boolean} [props.gradient=false] - Apply gradient background
 * @param {boolean} [props.glass=false] - Apply glass-morphism style
 * @param {'sm'|'md'|'lg'} [props.padding='md'] - Internal padding size
 * @returns {JSX.Element}
 */
const Card = ({
  children,
  className = '',
  gradient = false,
  glass = false,
  padding = 'md'
}) => {
  return (
    <div className={getCardClasses(gradient, glass, padding, className)}>
      {children}
    </div>
  );
};

export default Card;
