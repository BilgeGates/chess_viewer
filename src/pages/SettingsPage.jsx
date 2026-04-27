import { memo, useCallback, useEffect, useState } from 'react';

import { Database, Download, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ToolPageHeader } from '@/components/layout';
import { useLocalStorage } from '@/hooks';
import {
  DataManagement,
  ExportCustomization,
  ThemeCustomization
} from '@/pages/settings';

const pageTabs = [
  {
    id: 'theme',
    label: 'Theme Customization',
    shortLabel: 'Theme',
    icon: Palette
  },
  {
    id: 'export',
    label: 'Export Customization',
    shortLabel: 'Export',
    icon: Download
  },
  {
    id: 'data',
    label: 'Data Management',
    shortLabel: 'Data',
    icon: Database
  }
];
/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const SettingsPage = memo(function SettingsPage() {
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
  const handleBack = useCallback(() => navigate(-1), [navigate]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') handleBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleBack]);
  return (
    <div className="h-full max-h-full flex flex-col bg-bg overflow-hidden">
      <ToolPageHeader title="Settings" onBack={handleBack} showSave={false} />

      <div className="flex-shrink-0 bg-surface-elevated border-b border-border animate-fadeIn">
        <div className="px-3 sm:px-6 overflow-x-auto">
          <div className="flex gap-0 min-w-max sm:min-w-0">
            {pageTabs.map(({ id, icon: Icon, label, shortLabel }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3 sm:px-5 py-2.5 sm:py-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 border-b-2 whitespace-nowrap hover:scale-105 active:scale-95 ${activeTab === id ? 'text-accent border-accent bg-accent/5 scale-105' : 'text-text-secondary hover:text-text-primary border-transparent hover:bg-surface-hover'}`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${activeTab === id ? 'scale-110' : ''}`}
                />
                <span className="sm:hidden">{shortLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden min-h-0">
        <div className="h-full px-3 sm:px-5 py-3 sm:py-4 overflow-hidden">
          {activeTab === 'theme' && (
            <div className="h-full animate-pageEnter">
              <ThemeCustomization />
            </div>
          )}
          {activeTab === 'export' && (
            <div className="h-full animate-pageEnter">
              <ExportCustomization
                boardSize={boardSize}
                setBoardSize={setBoardSize}
                fileName={fileName}
                setFileName={setFileName}
                exportQuality={exportQuality}
                setExportQuality={setExportQuality}
              />
            </div>
          )}
          {activeTab === 'data' && (
            <div className="h-full animate-pageEnter">
              <DataManagement />
            </div>
          )}
        </div>
      </main>
    </div>
  );
});
SettingsPage.displayName = 'SettingsPage';
export default SettingsPage;
