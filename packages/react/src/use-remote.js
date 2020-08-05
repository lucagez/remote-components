import { useState, useEffect } from 'react';
import { remotes } from '@remote-components/core';

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
 * @param {number} [config.retries] - Number of retries when encountring errors while
 * fetching components.
 * @param {('none'|'stale'|'revalidate'|'rerender')} [config.cacheStrategy] - Caching strategy
 * to be used
 */
const useRemote = ({
  url,
  dependencies = {},
  cacheStrategy = 'none',
  timeout,
  retries = 1,
} = {}) => {
  // TODO: => add unmounting callbacks on unmounted components
  // let flag = false

  const [data, setData] = useState({});
  const [retry, setRetry] = useState(retries);

  const onDone = (component) => {
    setData({ data: component });
  };

  const onRetry = () => {
    if (retry) setRetry(retry - 1);
    remotes.remove(url);
  };

  const onError = (error) => {
    if (timeout && retries) setTimeout(onRetry, timeout);

    setData({ error });
  };

  useEffect(() => {
    setData({ loading: true });

    /**
     * TODO: add relative and base
     */
    remotes.import({
      url,
      dependencies,
      cacheStrategy,
      onDone,
      onError,
    });

    // return () => {
    //   flag = true;
    // };
  }, [retry]);

  return data;
};

export { useRemote };
