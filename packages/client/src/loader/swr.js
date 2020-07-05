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
  cache: cacheOptions,
}) => {
  const cacheStorage = await caches.open(DEFAULT_CACHE_NAME);
  const cachedResponse = await cacheStorage.match(url);

  if (cachedResponse?.ok) {
    onDone(await cachedResponse.text());
  }

  // TODO: add timeouts
  idle(async () => {
    try {
      if (!cacheOptions.refetch && cachedResponse?.ok) return;
      if (!navigator.onLine) return;

      const request = new Request(url);
      const response = await fetch(request);

      cacheStorage.put(request, response.clone());

      if (!cacheOptions.rerender) return;

      onDone(await response.text());
    } catch {
      onError(new URIError(`Error while loading ${url}`));
    }
  });
};
