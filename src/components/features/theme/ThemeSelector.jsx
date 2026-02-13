import { Button } from '@/components/ui';
import { Palette } from 'lucide-react';

/**
 * Button to open theme customization.
 *
 * @param {Object} props
 * @param {Function} props.onOpenModal - Handler to open theme modal
 * @returns {JSX.Element}
 */
const ThemeSelector = ({ onOpenModal }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text-secondary">
        Board Theme
      </label>
      <Button onClick={onOpenModal} variant="gradient" icon={Palette} fullWidth>
        Customize Theme
      </Button>
    </div>
  );
};

export default ThemeSelector;
