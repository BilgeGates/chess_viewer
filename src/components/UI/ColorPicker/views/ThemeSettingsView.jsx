const ThemeSettingsView = () => {
  const settings = [
    { label: "Auto Apply on Select", defaultChecked: false },
    { label: "Show RGB Values", defaultChecked: true },
    { label: "Enable Animations", defaultChecked: true },
    { label: "Dark Mode", defaultChecked: true },
  ];

  return (
    <div className="p-5 space-y-3">
      {settings.map(({ label, defaultChecked }) => (
        <div
          key={label}
          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all"
        >
          <span className="text-sm text-gray-300">{label}</span>
          <input
            type="checkbox"
            defaultChecked={defaultChecked}
            className="w-4 h-4 accent-blue-600"
          />
        </div>
      ))}
    </div>
  );
};

export default ThemeSettingsView;
