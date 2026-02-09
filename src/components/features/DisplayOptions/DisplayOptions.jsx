import { Checkbox } from '@/components/ui';
import { QUALITY_PRESETS } from '@/constants/chessConstants';

const DisplayOptions = ({
  showCoords,
  setShowCoords,
  showCoordinateBorder,
  setShowCoordinateBorder,
  exportQuality = 16
}) => {
  const preset = QUALITY_PRESETS.find((p) => p.value === exportQuality);
  const isBorderForced = preset?.forceCoordinateBorder || false;
  const isSocialMode = preset?.mode === 'social';

  const effectiveBorderState = isBorderForced || showCoordinateBorder;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text-secondary mb-3">
        Display Options
      </label>

      <Checkbox
        checked={showCoords}
        onChange={(e) => setShowCoords(e.target.checked)}
        label="Show Coordinates"
      />

      {showCoords && (
        <div className="ml-0">
          <Checkbox
            checked={effectiveBorderState}
            onChange={(e) => {
              if (!isBorderForced) {
                setShowCoordinateBorder(e.target.checked);
              }
            }}
            disabled={isBorderForced}
            label={
              <span className="flex items-center gap-2">
                Coordinate Border
                {isBorderForced && (
                  <span className="text-xs text-warning font-normal">
                    (Required for {exportQuality}× export)
                  </span>
                )}
              </span>
            }
          />
          {isSocialMode && (
            <p className="text-xs text-text-muted mt-1 ml-6">
              Border is required for social/zoom export modes (24×, 32×)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayOptions;
