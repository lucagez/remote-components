import { DEFAULT_CACHE_NAME } from '../utils/cache';
import { url as makeUrl } from '../utils/url';

/**
 * TODO: Add config:
 * - cache deletion
 * - no cache
 * - refresh / revalidate
 * - timeout -> revalidate after n ms
 */
const swrFetch = async ({
  url,
  cacheStrategy = 'none',
  base,
  relative
}) => {
  const cacheStorage = await caches.open(DEFAULT_CACHE_NAME);
  const cachedResponse = await cacheStorage.match(url);
  const inCache = cachedResponse?.ok;
  const target = makeUrl(url, base);

  const strategy = {
    stale: inCache && /stale/.test(cacheStrategy),
    revalidate: !inCache || /revalidate|rerender/.test(cacheStrategy),
    rerender: !inCache || /rerender/.test(cacheStrategy),
  };

  if (inCache) {
    return cachedResponse.text();
  }

  try {
    if (strategy.stale) return;
    if (!navigator.onLine) return;

    const request = new Request(target.href);
    const response = await fetch(request);

    if (strategy.revalidate) {
      cacheStorage.put(request, response.clone());
    }

    if (strategy.rerender) {
      return response.text();
    }
  } catch {
    throw new URIError(`Error while loading ${target.href}`);
  }
};

export { swrFetch };
