import { Checkbox } from "../UI";

const DisplayOptions = ({ showCoords, setShowCoords }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-300 mb-3">
        Display Options
      </label>
      <Checkbox
        checked={showCoords}
        onChange={(e) => setShowCoords(e.target.checked)}
        label="Show Coordinates"
      />
    </div>
  );
};

export default DisplayOptions;
