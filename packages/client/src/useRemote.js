import { useState, useEffect } from 'react';
import { removeComponent, getComponent } from './scopes';
import { remoteImport } from './loader';
import { contextify } from './contextify';

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
 */
const useRemote = ({ url, dependencies = {}, timeout, retries = 1 } = {}) => {
  const [data, setData] = useState({ loading: true });
  const [retry, setRetry] = useState(retries);

  const onDone = (source) => {
    try {
      /**
       * Indirect eval call.
       * Evaluating source in a mocked context.
       * Providing ad-hoc module, exports and require objects.
       */
      contextify(url, source, dependencies);

      setData({
        data: getComponent(url),
      });
    } catch (error) {
      /**
       * Evaluation error
       */
      setData({
        error,
      });
    }
  };

  const onRetry = () => {
    if (retry) setRetry(retry - 1);
    removeComponent(url);
  };

  const onError = (error) => {
    if (timeout && retries) setTimeout(onRetry, timeout);

    setData({
      error,
    });
  };

  useEffect(() => {
    const registered = getComponent(url);

    setData({
      loading: typeof registered === 'undefined',
      data: registered,
    });

    if (typeof registered !== 'undefined') return;

    remoteImport(url, {
      onDone,
      onError,
    });
  }, [retry]);

  return data;
};

export { useRemote };
