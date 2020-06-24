/**
 * TODO: Add config:
 * - cache deletion
 * - no cache
 * - refresh / revalidate
 * - timeout -> revalidate after n ms
 */
export const swrImport = async (url, { onError, onDone }) => {
  const cacheStorage = await caches.open('__REMOTE_COMPONENTS__v1');
  const cachedResponse = await cacheStorage.match(url) || {};

  if (cachedResponse.ok) {
    onDone(await cachedResponse.text());
  }

  try {
    if (!navigator.onLine) return;

    window.requestIdleCallback(async () => {
      console.log('IDLE')
      const request = new Request(url);
      const response = await fetch(request);
  
      cacheStorage.put(request, response.clone());
  
      onDone(await response.text());
    });
  } catch {
    onError(new URIError(`Error while loading ${url}`));
  }
};
