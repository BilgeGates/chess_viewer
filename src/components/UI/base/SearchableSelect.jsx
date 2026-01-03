import { useState } from "react";
import { CheckCircle, ChevronDown, SearchX } from "lucide-react";

const SearchableSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Search...",
  emptyMessage = "No results found",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((opt) => opt.id === value);

  let displayOptions;
  if (search.trim() === "") {
    displayOptions = [
      ...(selectedOption ? [selectedOption] : []),
      ...options.filter((opt) => opt.id !== value),
    ];
  } else {
    displayOptions = options.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-300">
          {label}
        </label>
      )}
      <div className="select-container">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            outline: "none",
            boxShadow: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          className={`relative select-custom w-full px-4 py-3 pr-12 bg-gray-950/50 text-sm text-gray-200 text-left font-medium cursor-pointer transition-all duration-500 ${
            isOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl"
          } ${!isOpen ? "active:scale-[0.98]" : ""}`}
        >
          {!isOpen && selectedOption ? (
            <span className="font-semibold hover:text-blue-400">
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
              className="w-full bg-transparent border-none outline-none caret-blue-400"
            />
          )}

          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <ul
          className={`w-full bg-gray-950/50 rounded-b-xl transition-all duration-300 ease-in-out origin-top select-custom ${
            isOpen
              ? "opacity-100 scale-y-100 max-h-60 overflow-y-auto rounded-t-none"
              : "opacity-0 scale-y-95 max-h-0 overflow-hidden pointer-events-none"
          }`}
        >
          {displayOptions.length === 0 && search.trim() !== "" && (
            <li className="px-4 py-3 flex items-center text-sm text-red-400 gap-2 select-none">
              <SearchX className="w-5 h-5 text-red-500/70" />
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
                  setSearch("");
                }}
                className={`group px-4 py-3 cursor-pointer flex justify-between items-center transition-all duration-200 hover:bg-blue-500/20 hover:pl-5 ${
                  isSelected
                    ? "text-emerald-400 font-semibold"
                    : "text-gray-200"
                }`}
              >
                <span>{option.name}</span>
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          display: none;
        }

        .select-custom::-webkit-scrollbar {
          width: 3px;
        }

        .select-custom::-webkit-scrollbar-track {
          background: rgba(26, 26, 36, 0.8);
          border-radius: 10px;
          margin: 4px 0;
        }

        .select-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .select-custom::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
        }
      `}</style>
    </div>
  );
};

export default SearchableSelect;
