import { useState } from 'react';
import { CheckCircle, ChevronDown, SearchX } from 'lucide-react';

/**
 * Searchable dropdown select with real-time filtering.
 * @param {Object} props
 * @param {{id: string, name: string}[]} props.options - Available options
 * @param {string} [props.value] - Currently selected option id
 * @param {Function} props.onChange - Called with the selected option id
 * @param {string} [props.label] - Visible label above the control
 * @param {string} [props.placeholder='Search...'] - Search input placeholder
 * @param {string} [props.emptyMessage='No results found'] - Message shown when filtering yields no results
 * @returns {JSX.Element}
 */
const SearchableSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search...',
  emptyMessage = 'No results found'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find((opt) => opt.id === value);

  let displayOptions;
  if (search.trim() === '') {
    displayOptions = [
      ...(selectedOption ? [selectedOption] : []),
      ...options.filter((opt) => opt.id !== value)
    ];
  } else {
    displayOptions = options.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <div className="select-container">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            outline: 'none',
            boxShadow: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
          className={`relative select-custom w-full px-4 py-3 pr-12 bg-surface-hover/50 border border-border text-sm text-text-primary text-left font-medium cursor-pointer transition-all duration-300 ${
            isOpen
              ? 'rounded-t-xl rounded-b-none border-b-0'
              : 'rounded-xl hover:border-accent/50'
          } ${!isOpen ? 'active:scale-[0.98]' : ''}`}
        >
          {!isOpen && selectedOption ? (
            <span className="font-semibold hover:text-accent transition-colors">
              {selectedOption.name}
            </span>
          ) : (
            <input
              type="search"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              spellCheck={false}
              className="w-full bg-transparent border-none outline-none caret-accent text-text-primary placeholder-text-muted"
            />
          )}

          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted cursor-pointer transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <ul
          className={`w-full bg-bg-secondary/95 backdrop-blur-lg border border-border border-t-0 rounded-b-xl transition-all duration-300 ease-in-out origin-top select-custom ${
            isOpen
              ? 'opacity-100 scale-y-100 max-h-60 overflow-y-auto'
              : 'opacity-0 scale-y-95 max-h-0 overflow-hidden pointer-events-none'
          }`}
        >
          {displayOptions.length === 0 && search.trim() !== '' && (
            <li className="px-4 py-3 flex items-center text-sm text-error gap-2 select-none">
              <SearchX className="w-5 h-5 text-error/70" />
              <span className="font-medium">{emptyMessage}</span>
            </li>
          )}

          {displayOptions.map((option) => {
            const isSelected = option.id === value;

            return (
              <li
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`group px-4 py-3 cursor-pointer flex justify-between items-center transition-all duration-200 hover:bg-accent/10 hover:pl-5 ${
                  isSelected
                    ? 'text-accent font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{option.name}</span>
                {isSelected && <CheckCircle className="w-4 h-4 text-accent" />}
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        input[type='search']::-webkit-search-decoration,
        input[type='search']::-webkit-search-cancel-button,
        input[type='search']::-webkit-search-results-button,
        input[type='search']::-webkit-search-results-decoration {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SearchableSelect;
