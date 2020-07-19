import { modern } from '../features';

const DEFAULT_CACHE_NAME = '__REMOTE_COMPONENTS__v1';

/**
 * clearCache.
 *
 * Destroy current cache
 */
const clearCache = async () => {
  if (!modern) return;

  const keys = await caches.keys();
  const current = keys.find((key) => key === DEFAULT_CACHE_NAME);

  return caches.delete(current);
};

/**
 * clearEntries.
 *
 * Remove entries from cache
 *
 * @param {array} entries - Url to be removed from cache
 */
const clearEntries = async (entries) => {
  if (!modern) return;

  const current = await caches.open(DEFAULT_CACHE_NAME);
  const deletes = entries.map((entry) => current.delete(entry));

  return Promise.all(deletes);
};

export {
  clearCache,
  clearEntries,
  DEFAULT_CACHE_NAME,
};
