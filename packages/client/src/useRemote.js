import { useState, useEffect } from 'react';
import { removeComponent, getComponent } from './register';
import { remoteImport } from './loader';

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
const useRemote = ({ name, url, timeout, retries = 1 } = {}) => {
  const [data, setData] = useState({ loading: true });
  const [retry, setRetry] = useState(retries);

  const onDone = (source) => {
    try {
      /**
       * Indirect eval call.
       * This is going to force the evaluation of source
       * code to happen in global context.
       */
      (0, eval)(source);

      setData({
        data: getComponent(name),
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

  const onError = (error) => {
    if (timeout && retries) {
      setTimeout(
        () => {
          if (retry) setRetry(retry - 1);
          removeComponent(name);
        },
        timeout,
      );
    }

    setData({
      error,
    });
  };

  useEffect(() => {
    const cached = getComponent(name);

    setData({
      loading: typeof cached === 'undefined',
      data: cached,
    });

    if (typeof cached !== 'undefined') return;

    remoteImport(url, {
      onDone,
      onError,
    })
  }, [retry]);

  return data;
};

export { useRemote };
