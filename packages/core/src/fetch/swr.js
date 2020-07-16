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
  relative,
  onCache = () => void 0,
  onDone = () => void 0,
  onError = () => void 0,
}) => {
  const cacheStorage = await caches.open(DEFAULT_CACHE_NAME);
  const cachedResponse = await cacheStorage.match(url);
  const inCache = cachedResponse?.ok;
  const target = makeUrl(url, base, relative);

  const strategy = {
    stale: inCache && /stale/.test(cacheStrategy),
    revalidate: !inCache || /revalidate|rerender/.test(cacheStrategy),
    rerender: !inCache || /rerender/.test(cacheStrategy),
  };

  if (inCache) {
    onDone(await cachedResponse.text());
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
      onDone(await response.text());
    }
  } catch {
    onError(new URIError(`Error while loading ${target.href}`));
  }
};

export { swrFetch };
