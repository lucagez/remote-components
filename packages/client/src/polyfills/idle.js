
/**
 * Naive requestIdleCallback polyfill.
 */
export const idle = typeof requestIdleCallback !== 'undefined'
  ? requestIdleCallback
  : (cb, { timeout = 1 } = {}) => setTimeout(cb, timeout);
