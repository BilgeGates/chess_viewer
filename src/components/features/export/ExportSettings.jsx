import { Settings } from 'lucide-react';

import { Button } from '@/components/ui';

/**
 * Button to open export settings configuration.
 *
 * @param {Object} props
 * @param {Function} props.onOpenModal - Handler to open export modal
 * @returns {JSX.Element}
 */
const ExportSettings = ({ onOpenModal }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text-secondary">
        Export Settings
      </label>
      <Button
        onClick={onOpenModal}
        variant="gradient"
        icon={Settings}
        fullWidth
      >
        Configure Export
      </Button>
    </div>
  );
};

export default ExportSettings;
