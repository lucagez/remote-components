import { useState, useEffect } from 'react';
import { removeComponent } from './scopes';
import { remoteImport } from './import';

/**
 * useRemote.
 * React hook used to retrieve remote components
 *
 * usage:
 * ```jsx
 * const { data: Component, loading, error } = useRemote({ url: 'remote.source.com/component.js' });
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
 * @param {object} config
 * @param {string} config.url - URL of the remote component
 * @param {string} [config.dependencies] - Scoped dependencies.
 * @param {number} [config.timeout] - Time (ms) between retries on errors when fetching.
 * @param {number} [config.retries] - Number of retries when encountring errors while fetching components.
 * @param {('none'|'stale'|'revalidate'|'rerender')} [config.cacheStrategy] - Caching strategy to be used
 */
const useRemote = ({
  url,
  dependencies = {},
  cacheStrategy = 'none',
  timeout,
  retries = 1,
} = {}) => {
  const [data, setData] = useState({ loading: true });
  const [retry, setRetry] = useState(retries);

  const onDone = (component) => {
    setData({ data: component });
  };

  const onRetry = () => {
    if (retry) setRetry(retry - 1);
    removeComponent(url);
  };

  const onError = (error) => {
    if (timeout && retries) setTimeout(onRetry, timeout);

    setData({ error });
  };

  useEffect(() => {
    remoteImport({
      url,
      dependencies,
      cacheStrategy,
    })
      .then(onDone)
      .catch(onError);
  }, [retry]);

  return data;
};

export { useRemote };
