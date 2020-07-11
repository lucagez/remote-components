import { idle } from '../polyfills';
import { DEFAULT_CACHE_NAME } from '../cache-utils';

/**
 * TODO: Add config:
 * - cache deletion
 * - no cache
 * - refresh / revalidate
 * - timeout -> revalidate after n ms
 */
export const swrImport = (url, {
  cacheStrategy = 'none',
}) => new Promise(async (resolve, reject) => {
  // TODO: check if component is already registered?

  const cacheStorage = await caches.open(DEFAULT_CACHE_NAME);
  const cachedResponse = await cacheStorage.match(url);
  const inCache = cachedResponse?.ok;

  const strategy = {
    stale: inCache && /stale/.test(cacheStrategy),
    revalidate: !inCache || /revalidate|rerender/.test(cacheStrategy),
    rerender: !inCache || /rerender/.test(cacheStrategy),
  };

  if (inCache) {
    return resolve(await cachedResponse.text());
  }

  // TODO: add timeouts
  idle(async () => {
    try {
      if (strategy.stale) return;
      if (!navigator.onLine) return;

      const request = new Request(url);
      const response = await fetch(request);

      if (strategy.revalidate) {
        cacheStorage.put(request, response.clone());
      }

      if (strategy.rerender) {
        return resolve(await response.text());
      };
    } catch {
      return reject(new URIError(`Error while loading ${url}`));
    }
  });
});
