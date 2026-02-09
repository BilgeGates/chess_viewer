import { memo, useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Custom date picker component with professional modal design
 * @param {Object} props
 * @param {number|undefined} props.value - Unix timestamp or undefined
 * @param {function(number|undefined):void} props.onChange - Change callback
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.label] - Input label
 * @returns {JSX.Element}
 */
const DatePicker = memo(
  ({ value, onChange, placeholder = 'Select date', label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
      if (value) return new Date(value);
      return new Date();
    });
    const containerRef = useRef(null);

    /**
     * Close picker when clicking outside
     */
    useEffect(() => {
      /**
       * @param {MouseEvent} event - Click event
       * @returns {void}
       */
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    /**
     * Format date for display
     * @param {number} timestamp - Unix timestamp
     * @returns {string}
     */
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    /**
     * Get days in month
     * @param {number} year - Full year
     * @param {number} month - Month (0-11)
     * @returns {number}
     */
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    /**
     * Get first day of month (0 = Sunday, 6 = Saturday)
     * @param {number} year - Full year
     * @param {number} month - Month (0-11)
     * @returns {number}
     */
    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };

    /**
     * Handle date selection
     * @param {number} day - Day of month
     * @returns {void}
     */
    const handleDateSelect = (day) => {
      const selected = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        day
      );
      onChange(selected.getTime());
      setIsOpen(false);
    };

    /**
     * Navigate to previous month
     * @returns {void}
     */
    const handlePreviousMonth = () => {
      setViewDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      );
    };

    /**
     * Navigate to next month
     * @returns {void}
     */
    const handleNextMonth = () => {
      setViewDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      );
    };

    /**
     * Clear selected date
     * @returns {void}
     */
    const handleClear = () => {
      onChange(undefined);
      setIsOpen(false);
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const selectedDate = value ? new Date(value) : null;
    const isToday = (day) => {
      const today = new Date();
      return (
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year
      );
    };
    const isSelected = (day) => {
      return (
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      );
    };

    return (
      <div className="relative" ref={containerRef}>
        {label && (
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            {label}
          </label>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent flex items-center justify-between gap-2 hover:bg-surface-hover transition-colors"
        >
          <span className={value ? 'text-text-primary' : 'text-text-muted'}>
            {value ? formatDate(value) : placeholder}
          </span>
          <Calendar className="w-4 h-4 text-accent" />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-72 bg-surface-elevated border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePreviousMonth}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-sm font-bold text-text-primary">
                  {monthNames[month]} {year}
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-3">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-xs font-semibold text-text-muted"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from(
                  { length: firstDay },
                  (_, index) => `empty-${year}-${month}-${index}`
                ).map((key) => (
                  <div key={key} className="h-8" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const selected = isSelected(day);
                  const today = isToday(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`
                      h-8 flex items-center justify-center text-sm rounded-lg font-medium transition-all
                      ${
                        selected
                          ? 'bg-accent text-bg shadow-md scale-105'
                          : today
                            ? 'bg-accent/20 text-accent font-bold'
                            : 'text-text-primary hover:bg-surface-hover'
                      }
                    `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-border bg-surface flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-text-muted hover:text-error transition-colors px-3 py-1.5"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(Date.now());
                  setIsOpen(false);
                }}
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors px-3 py-1.5"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
