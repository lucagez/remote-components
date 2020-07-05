import { modern } from './features'; 

const DEFAULT_CACHE_NAME = '__REMOTE_COMPONENTS__v1';

/**
 * clearCache.
 * 
 * Destroy current cache
 */
const _clearCache = async () => {
  const keys = await caches.keys();
  const current = keys.find(key => key === DEFAULT_CACHE_NAME);

  caches.delete(current);
};

/**
 * clearEntries.
 * 
 * Remove entries from cache
 * 
 * @param {array} entries - Url to be removed from cache
 */
const _clearEntries = (entries) => {
  const current = caches.open(DEFAULT_CACHE_NAME);
  const deletes = entries.map(entry => current.delete(entry));

  return Promise.all(deletes);
};

export const clearCache = modern ? _clearCache : () => void 0;
export const clearEntries = modern ? _clearEntries : () => void 0;
