/**
 * @typedef {Object} HistoryEntry
 * @property {number} id - Unique identifier (timestamp-based)
 * @property {string} fen - FEN notation string
 * @property {number} createdAt - Entry creation timestamp
 * @property {number} lastActiveAt - Last accessed/used timestamp
 * @property {'manual'|'export'|'drag'} source - Entry creation source
 * @property {boolean} isFavorite - Favorite flag
 * @property {string} [dragSessionId] - Drag session ID if applicable
 */

/**
 * @typedef {Object} ArchivedEntry
 * @property {number} id - Original entry ID
 * @property {string} fen - FEN notation string
 * @property {number} createdAt - Original creation timestamp
 * @property {number} lastActiveAt - Last active timestamp before archival
 * @property {number} archivedAt - Archival timestamp
 * @property {'manual'|'export'|'drag'} source - Original source
 * @property {'auto'|'manual'} archiveSource - How entry was archived
 * @property {boolean} isFavorite - Favorite flag
 */

/**
 * @typedef {'green'|'yellow'|'red'} StatusLevel
 */

/**
 * @typedef {Object} FilterOptions
 * @property {string} [fenSearch] - FEN text search string
 * @property {number} [dateFrom] - Start timestamp for date range
 * @property {number} [dateTo] - End timestamp for date range
 * @property {StatusLevel} [status] - Filter by status level
 * @property {'manual'|'export'|'drag'} [source] - Filter by source type
 * @property {boolean} [favoritesOnly] - Show only favorites
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * DAY_MS;
const THIRTY_DAYS_MS = 30 * DAY_MS;
const NINETY_DAYS_MS = 90 * DAY_MS;

/**
 * @param {number} lastActiveAt - Last active timestamp
 * @returns {StatusLevel}
 */
export const calculateStatus = (lastActiveAt) => {
  const now = Date.now();
  const age = now - lastActiveAt;

  if (age < SEVEN_DAYS_MS) return 'green';
  if (age < THIRTY_DAYS_MS) return 'yellow';
  return 'red';
};

/**
 * @param {number} lastActiveAt - Last active timestamp
 * @returns {boolean}
 */
export const shouldArchive = (lastActiveAt) => {
  const now = Date.now();
  const age = now - lastActiveAt;
  return age >= NINETY_DAYS_MS;
};

/**
 * Check if entry can be archived (not a favorite)
 * @param {HistoryEntry} entry - History entry to check
 * @returns {boolean}
 */
export const canArchive = (entry) => {
  return !entry.isFavorite && shouldArchive(entry.lastActiveAt);
};

/**
 * @param {number} lastActiveAt - Last active timestamp
 * @returns {number}
 */
export const daysUntilArchive = (lastActiveAt) => {
  const now = Date.now();
  const age = now - lastActiveAt;
  const remaining = NINETY_DAYS_MS - age;
  return Math.max(0, Math.ceil(remaining / DAY_MS));
};

/**
 * @param {HistoryEntry} entry - History entry to check
 * @param {FilterOptions} filters - Filter criteria
 * @returns {boolean}
 */
export const matchesFilters = (entry, filters) => {
  if (filters.fenSearch) {
    const searchLower = filters.fenSearch.toLowerCase();
    if (!entry.fen.toLowerCase().includes(searchLower)) {
      return false;
    }
  }

  if (filters.dateFrom && entry.createdAt < filters.dateFrom) {
    return false;
  }

  if (filters.dateTo && entry.createdAt > filters.dateTo) {
    return false;
  }

  if (filters.status) {
    const entryStatus = calculateStatus(entry.lastActiveAt);
    if (entryStatus !== filters.status) {
      return false;
    }
  }

  if (filters.source && entry.source !== filters.source) {
    return false;
  }

  if (filters.favoritesOnly && !entry.isFavorite) {
    return false;
  }

  return true;
};

/**
 * @param {HistoryEntry[]} entries - History entries to filter
 * @param {FilterOptions} filters - Filter criteria
 * @returns {HistoryEntry[]}
 */
export const applyFilters = (entries, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return entries;
  }

  return entries.filter((entry) => matchesFilters(entry, filters));
};

/**
 * @param {HistoryEntry[]} entries - History entries to partition
 * @returns {{active: HistoryEntry[], toArchive: HistoryEntry[]}}
 */
export const partitionByArchiveStatus = (entries) => {
  const active = [];
  const toArchive = [];

  entries.forEach((entry) => {
    // Favorites never get archived
    if (entry.isFavorite) {
      active.push(entry);
    } else if (shouldArchive(entry.lastActiveAt)) {
      toArchive.push(entry);
    } else {
      active.push(entry);
    }
  });

  return { active, toArchive };
};

/**
 * @param {HistoryEntry} entry - History entry to convert
 * @param {'auto'|'manual'} archiveSource - How entry is being archived
 * @returns {ArchivedEntry}
 */
export const convertToArchivedEntry = (entry, archiveSource = 'auto') => {
  return {
    id: entry.id,
    fen: entry.fen,
    createdAt: entry.createdAt,
    lastActiveAt: entry.lastActiveAt,
    archivedAt: Date.now(),
    source: entry.source,
    archiveSource,
    isFavorite: entry.isFavorite
  };
};

/**
 * @param {ArchivedEntry} archived - Archived entry to convert
 * @returns {HistoryEntry}
 */
export const convertFromArchivedEntry = (archived) => {
  return {
    id: archived.id,
    fen: archived.fen,
    createdAt: archived.createdAt,
    lastActiveAt: Date.now(),
    source: archived.source,
    isFavorite: archived.isFavorite
  };
};

/**
 * @param {HistoryEntry} entry - Entry to update
 * @returns {HistoryEntry}
 */
export const touchEntry = (entry) => {
  return {
    ...entry,
    lastActiveAt: Date.now()
  };
};

/**
 * @param {string} fen - FEN string
 * @param {'manual'|'export'|'drag'} source - Entry source
 * @param {string} [dragSessionId] - Drag session ID if applicable
 * @returns {HistoryEntry}
 */
export const createHistoryEntry = (fen, source, dragSessionId = null) => {
  const now = Date.now();
  return {
    id: now,
    fen,
    createdAt: now,
    lastActiveAt: now,
    source,
    isFavorite: false,
    ...(dragSessionId ? { dragSessionId } : {})
  };
};

/**
 * @param {HistoryEntry[]} entries - Entries to sort
 * @returns {HistoryEntry[]}
 */
export const sortByMostRecent = (entries) => {
  return [...entries].sort((a, b) => b.lastActiveAt - a.lastActiveAt);
};

/**
 * @param {ArchivedEntry[]} entries - Archived entries to sort
 * @returns {ArchivedEntry[]}
 */
export const sortArchivedByArchiveDate = (entries) => {
  return [...entries].sort((a, b) => b.archivedAt - a.archivedAt);
};
