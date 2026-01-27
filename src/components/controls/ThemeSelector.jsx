import { Palette } from 'lucide-react';
import { Button } from '../UI';

const ThemeSelector = ({ onOpenModal }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-300">
        Board Theme
      </label>
      <Button onClick={onOpenModal} variant="gradient" icon={Palette} fullWidth>
        Customize Theme
      </Button>
    </div>
  );
};

export default ThemeSelector;
