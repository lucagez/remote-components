import { useState, useEffect } from 'react';

/**
 * useRemote.
 * React hook used to retrieve remote components
 * 
 * usage:
 * ```jsx
 * const { data: Component, loading, error } = useRemote('remote.source.com/component.js');
 * 
 * if (loading) {
 *  return <p>Loading...</p>
 * }
 * 
 * if (error) {
 *  return <p>Spomething went wrong :(</p>
 * }
 * 
 * return <Component {...forwardedProps} />
 * 
 * ```
 * 
 * @param {string} url - URL of the remote component 
 * @param {object} config
 * @param {number} [config.timeout] - Time (ms) between retries on errors when fetching.
 * @param {number} [config.retries] - Number of retries when encountring errors while fetching components.
 */
const useRemote = (url, { timeout, retries = 1 } = {}) => {
  const [data, setData] = useState(undefined);
  const [retry, setRetry] = useState(retries);
  
  useEffect(() => {
    System.import(url)
    .then(({ default: remote }) => {
      setData(remote);
    })
    .catch((error) => {
      setData(error);
      setTimeout(() => {
        if (retry) setRetry(retry - 1);
        System.delete(url);
        }, timeout);
      });
  }, [retry]);

  if (data instanceof Error) {
    return { error: data.stack };
  }

  if (typeof data === 'undefined') {
    return { loading: true };
  }

  return { data };
};

export { useRemote };
