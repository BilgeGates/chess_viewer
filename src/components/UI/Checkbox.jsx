const Checkbox = ({ checked, onChange, label, className = "" }) => {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-emerald-500"
      />
      <span className="text-sm font-semibold text-gray-200 transition-colors">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
