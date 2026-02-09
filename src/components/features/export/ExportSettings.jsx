import { Settings } from 'lucide-react';

import { Button } from '@/components/ui';

const ExportSettings = ({ onOpenModal }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-300">
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
