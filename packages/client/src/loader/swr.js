import { idle } from '../polyfills';
import { DEFAULT_CACHE_NAME } from '../cache-utils';

/**
 * TODO: Add config:
 * - cache deletion
 * - no cache
 * - refresh / revalidate
 * - timeout -> revalidate after n ms
 */
export const swrImport = async (url, {
  onError,
  onDone,
  cacheStrategy = 'none',
}) => {
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
    onDone(await cachedResponse.text());
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
        onDone(await response.text());
      };
    } catch {
      onError(new URIError(`Error while loading ${url}`));
    }
  });
};
