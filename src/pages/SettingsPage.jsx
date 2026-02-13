import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeCustomization, ExportCustomization } from '@/pages/settings';
import { useLocalStorage } from '@/hooks';
import { ArrowLeft, Palette, Download, Save } from 'lucide-react';

const tabs = [
  { id: 'theme', label: 'Theme Customization', icon: Palette },
  { id: 'export', label: 'Export Customization', icon: Download }
];

/**
 * Settings page with Theme Customization and Export Customization tabs.
 * Layout mirrors the Advanced FEN Editor page structure.
 *
 * @returns {JSX.Element}
 */
const SettingsPage = memo(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('theme');

  const [boardSize, setBoardSize] = useLocalStorage('chess-board-size', 4);
  const [fileName, setFileName] = useLocalStorage(
    'chess-file-name',
    'chess-position'
  );
  const [exportQuality, setExportQuality] = useLocalStorage(
    'chess-export-quality',
    16
  );

  /**
   * @returns {void}
   */
  const handleBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') handleBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleBack]);

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-surface border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover rounded-xl transition-colors group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-accent group-hover:text-accent-hover transition-colors" />
                <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary">
                  Back
                </span>
              </button>
              <div className="h-8 w-px bg-border" />
              <h1 className="text-2xl font-display font-bold text-text-primary">
                Settings
              </h1>
            </div>
            <button
              onClick={handleBack}
              className="px-6 py-2.5 bg-warning hover:bg-warning/90 text-bg rounded-xl font-semibold transition-all shadow-glow-sm flex items-center gap-2"
              aria-label="Save and close"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-surface-elevated border-b border-border">
        <div className="px-6">
          <div className="flex gap-1">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === id
                    ? 'text-accent border-accent'
                    : 'text-text-secondary hover:text-text-primary border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
          {activeTab === 'theme' && <ThemeCustomization />}
          {activeTab === 'export' && (
            <ExportCustomization
              boardSize={boardSize}
              setBoardSize={setBoardSize}
              fileName={fileName}
              setFileName={setFileName}
              exportQuality={exportQuality}
              setExportQuality={setExportQuality}
            />
          )}
        </div>
      </main>
    </div>
  );
});

SettingsPage.displayName = 'SettingsPage';

export default SettingsPage;
