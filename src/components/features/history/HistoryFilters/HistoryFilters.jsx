import { memo, useState, useCallback } from 'react';
import { CustomSelect, DatePicker } from '@/components/ui';
import {
  Search,
  Filter,
  X,
  Circle,
  Zap,
  AlertCircle,
  Edit,
  Download,
  MousePointer
} from 'lucide-react';

/**
 * @param {Object} props
 * @param {FilterOptions} props.filters - Current filter state
 * @param {function(FilterOptions):void} props.onFiltersChange - Filter change callback
 * @param {boolean} [props.showStatus=true] - Show status filter
 * @param {boolean} [props.showFavoritesCheckbox=true] - Show favorites checkbox
 * @returns {JSX.Element}
 */
const HistoryFilters = memo(
  ({
    filters,
    onFiltersChange,
    showStatus = true,
    showFavoritesCheckbox = true
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    /**
     * @param {string} value - FEN search string
     * @returns {void}
     */
    const handleFenSearch = useCallback(
      (value) => {
        onFiltersChange({ ...filters, fenSearch: value || undefined });
      },
      [filters, onFiltersChange]
    );

    /**
     * @param {StatusLevel|''} value - Status level
     * @returns {void}
     */
    const handleStatusChange = useCallback(
      (value) => {
        onFiltersChange({ ...filters, status: value || undefined });
      },
      [filters, onFiltersChange]
    );

    /**
     * @param {'manual'|'export'|'drag'|''} value - Source type
     * @returns {void}
     */
    const handleSourceChange = useCallback(
      (value) => {
        onFiltersChange({ ...filters, source: value || undefined });
      },
      [filters, onFiltersChange]
    );

    /**
     * @param {boolean} value - Favorites only flag
     * @returns {void}
     */
    const handleFavoritesToggle = useCallback(
      (value) => {
        onFiltersChange({ ...filters, favoritesOnly: value || undefined });
      },
      [filters, onFiltersChange]
    );

    /**
     * @returns {void}
     */
    const clearFilters = useCallback(() => {
      onFiltersChange({});
      setIsExpanded(false);
    }, [onFiltersChange]);

    const hasActiveFilters = Object.keys(filters).length > 0;

    // Status options with icons
    const statusOptions = [
      {
        value: '',
        label: 'All Status',
        icon: <Circle className="w-3.5 h-3.5 text-text-muted" />
      },
      {
        value: 'green',
        label: 'Fresh (< 7 days)',
        icon: <Circle className="w-3.5 h-3.5 text-green-500 fill-green-500" />
      },
      {
        value: 'yellow',
        label: 'Aging (< 30 days)',
        icon: <Zap className="w-3.5 h-3.5 text-yellow-500" />
      },
      {
        value: 'red',
        label: 'Stale (< 90 days)',
        icon: <AlertCircle className="w-3.5 h-3.5 text-red-500" />
      }
    ];

    // Source options with icons
    const sourceOptions = [
      {
        value: '',
        label: 'All Sources',
        icon: <Filter className="w-3.5 h-3.5 text-text-muted" />
      },
      {
        value: 'manual',
        label: 'Manual Input',
        icon: <Edit className="w-3.5 h-3.5 text-accent" />
      },
      {
        value: 'export',
        label: 'Export',
        icon: <Download className="w-3.5 h-3.5 text-accent" />
      },
      {
        value: 'drag',
        label: 'Drag & Drop',
        icon: <MousePointer className="w-3.5 h-3.5 text-accent" />
      }
    ];

    return (
      <div className="bg-surface-elevated border-b border-border">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search FEN positions..."
                value={filters.fenSearch || ''}
                onChange={(e) => handleFenSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isExpanded || hasActiveFilters
                  ? 'bg-accent text-bg'
                  : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && !isExpanded && (
                <span className="bg-bg text-accent w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="p-2.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                aria-label="Clear filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {isExpanded && (
            <div
              className={`mt-4 grid grid-cols-1 sm:grid-cols-2 ${showStatus ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 pt-4 border-t border-border`}
            >
              {showStatus && (
                <CustomSelect
                  value={filters.status || ''}
                  onChange={handleStatusChange}
                  options={statusOptions}
                  placeholder="All Status"
                  label="Status"
                />
              )}

              <CustomSelect
                value={filters.source || ''}
                onChange={handleSourceChange}
                options={sourceOptions}
                placeholder="All Sources"
                label="Source"
              />

              <DatePicker
                value={filters.dateFrom}
                onChange={(value) =>
                  onFiltersChange({ ...filters, dateFrom: value })
                }
                placeholder="Start date"
                label="Date From"
              />

              <DatePicker
                value={filters.dateTo}
                onChange={(value) =>
                  onFiltersChange({ ...filters, dateTo: value })
                }
                placeholder="End date"
                label="Date To"
              />

              {showFavoritesCheckbox && (
                <div
                  className={`${showStatus ? 'sm:col-span-2 lg:col-span-4' : 'sm:col-span-2 lg:col-span-3'}`}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.favoritesOnly || false}
                      onChange={(e) => handleFavoritesToggle(e.target.checked)}
                      className="w-4 h-4 text-accent bg-surface border-border rounded focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-sm font-medium text-text-primary">
                      Show favorites only
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

HistoryFilters.displayName = 'HistoryFilters';

export default HistoryFilters;
