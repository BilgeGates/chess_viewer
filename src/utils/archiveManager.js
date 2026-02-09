import { logger } from './logger';
import {
  convertToArchivedEntry,
  convertFromArchivedEntry,
  partitionByArchiveStatus,
  sortArchivedByArchiveDate
} from './historyUtils';

/**
 * @typedef {import('./historyUtils').HistoryEntry} HistoryEntry
 * @typedef {import('./historyUtils').ArchivedEntry} ArchivedEntry
 */

const ARCHIVE_STORAGE_KEY = 'fen-history-archive';
const MAX_ARCHIVE_SIZE = 10000;

/**
 * @returns {Promise<ArchivedEntry[]>}
 */
export const loadArchive = async () => {
  try {
    if (window.storage) {
      const result = await window.storage.get(ARCHIVE_STORAGE_KEY);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
    }
  } catch {
    logger.log('Cloud storage not available for archive');
  }

  try {
    const localData = window.localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
  } catch (err) {
    logger.error('Failed to load archive:', err);
  }

  return [];
};

/**
 * @param {ArchivedEntry[]} archive - Archive entries to save
 * @returns {Promise<void>}
 */
export const saveArchive = async (archive) => {
  const trimmedArchive = archive.slice(0, MAX_ARCHIVE_SIZE);
  const jsonData = JSON.stringify(trimmedArchive);

  try {
    window.localStorage.setItem(ARCHIVE_STORAGE_KEY, jsonData);

    if (window.storage) {
      await window.storage.set(ARCHIVE_STORAGE_KEY, jsonData);
    }
  } catch (err) {
    logger.error('Failed to save archive:', err);
    throw err;
  }
};

/**
 * @param {HistoryEntry[]} entries - Entries to archive
 * @param {ArchivedEntry[]} existingArchive - Current archive
 * @param {'auto'|'manual'} source - Archive source
 * @returns {Promise<{archive: ArchivedEntry[], archived: number}>}
 */
export const archiveEntries = async (
  entries,
  existingArchive,
  source = 'auto'
) => {
  const archivedEntries = entries.map((entry) =>
    convertToArchivedEntry(entry, source)
  );

  const newArchive = sortArchivedByArchiveDate([
    ...archivedEntries,
    ...existingArchive
  ]);

  await saveArchive(newArchive);

  return {
    archive: newArchive,
    archived: archivedEntries.length
  };
};

/**
 * @param {HistoryEntry[]} activeEntries - Active history entries
 * @returns {Promise<{toArchive: HistoryEntry[], remaining: HistoryEntry[]}>}
 */
export const findEntriesForAutoArchive = async (activeEntries) => {
  const { active, toArchive } = partitionByArchiveStatus(activeEntries);

  return {
    toArchive,
    remaining: active
  };
};

/**
 * @param {number} id - Archived entry ID to reactivate
 * @param {ArchivedEntry[]} archive - Current archive
 * @returns {Promise<{entry: HistoryEntry, archive: ArchivedEntry[]}>}
 */
export const reactivateEntry = async (id, archive) => {
  const archivedEntry = archive.find((entry) => entry.id === id);

  if (!archivedEntry) {
    throw new Error('Archived entry not found');
  }

  const reactivated = convertFromArchivedEntry(archivedEntry);
  const updatedArchive = archive.filter((entry) => entry.id !== id);

  await saveArchive(updatedArchive);

  return {
    entry: reactivated,
    archive: updatedArchive
  };
};

/**
 * @param {number} id - Archived entry ID to delete
 * @param {ArchivedEntry[]} archive - Current archive
 * @returns {Promise<ArchivedEntry[]>}
 */
export const deleteArchivedEntry = async (id, archive) => {
  const updatedArchive = archive.filter((entry) => entry.id !== id);
  await saveArchive(updatedArchive);
  return updatedArchive;
};

/**
 * @returns {Promise<void>}
 */
export const clearArchive = async () => {
  try {
    window.localStorage.removeItem(ARCHIVE_STORAGE_KEY);

    if (window.storage) {
      await window.storage.delete(ARCHIVE_STORAGE_KEY);
    }
  } catch (err) {
    logger.error('Failed to clear archive:', err);
    throw err;
  }
};

/**
 * @param {ArchivedEntry[]} archive - Archive to get statistics for
 * @returns {{total: number, bySource: {manual: number, export: number, drag: number}, favorites: number}}
 */
export const getArchiveStatistics = (archive) => {
  const stats = {
    total: archive.length,
    bySource: {
      manual: 0,
      export: 0,
      drag: 0
    },
    favorites: 0
  };

  archive.forEach((entry) => {
    stats.bySource[entry.source]++;
    if (entry.isFavorite) {
      stats.favorites++;
    }
  });

  return stats;
};

/**
 * @returns {Promise<{entries: HistoryEntry[], archive: ArchivedEntry[], archivedCount: number}>}
 */
export const performAutoArchival = async () => {
  try {
    const historyData = window.localStorage.getItem('fen-history');
    if (!historyData) {
      return { entries: [], archive: [], archivedCount: 0 };
    }

    const activeEntries = JSON.parse(historyData);
    const { toArchive, remaining } =
      await findEntriesForAutoArchive(activeEntries);

    if (toArchive.length === 0) {
      return {
        entries: activeEntries,
        archive: await loadArchive(),
        archivedCount: 0
      };
    }

    const existingArchive = await loadArchive();
    const { archive } = await archiveEntries(
      toArchive,
      existingArchive,
      'auto'
    );

    window.localStorage.setItem('fen-history', JSON.stringify(remaining));

    if (window.storage) {
      await window.storage.set('fen-history', JSON.stringify(remaining));
    }

    logger.log(`Auto-archived ${toArchive.length} entries`);

    return {
      entries: remaining,
      archive,
      archivedCount: toArchive.length
    };
  } catch (err) {
    logger.error('Auto-archival failed:', err);
    throw err;
  }
};
