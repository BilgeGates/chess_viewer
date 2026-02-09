import { getCardClasses } from '@/utils';

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
