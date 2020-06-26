/**
 * Feature used to switch to modern environment.
 * Enhance without adding tons of polyfills:
 * - native fetch
 * - Caching
 * - navigator connection check
 * - requestIdleCallback (perform revalidate operations during downtime)
 * - async/await operations
 */
export const modern = ![
  typeof Cache,
  typeof Promise,
].includes('undefined');
