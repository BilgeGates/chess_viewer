import { Settings } from "lucide-react";
import { QUALITY_PRESETS } from "../../constants/chessConstants";
import { Modal, Button, Input } from "../UI";

const ExportSettingsModal = ({
  isOpen,
  onClose,
  fileName,
  setFileName,
  exportQuality,
  setExportQuality,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Settings"
      icon={Settings}
      iconColor="text-blue-400"
    >
      <div className="space-y-5">
        {/* Export Quality */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-300">
              Export Quality
            </label>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {QUALITY_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setExportQuality(preset.value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  exportQuality === preset.value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-950/50 text-gray-300 hover:bg-gray-700"
                }`}
                title={preset.description}
              >
                {preset.value}x
              </button>
            ))}
          </div>
        </div>

        {/* File Name */}
        <Input
          label="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="chess-position"
        />
        <p className="text-xs text-gray-400 -mt-2">
          <strong className="text-gray-300 font-mono">
            {fileName || "chess-position"}
          </strong>
          .png or .jpeg
        </p>

        <Button onClick={onClose} variant="primary" fullWidth>
          Done
        </Button>
      </div>
    </Modal>
  );
};

export default ExportSettingsModal;
