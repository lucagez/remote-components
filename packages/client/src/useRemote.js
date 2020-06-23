import { useState, useEffect } from 'react';
import { removeComponent, getComponent } from './register';

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

  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status !== 200) return;

    try {
      /**
       * Indirect eval call.
       * This is going to force the evaluation of source
       * code to happen in global context.
       */
      (0, eval)(request.responseText);

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

  request.onerror = () => {
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
      error: new URIError(`Error while loading ${url}`),
    });
  };

  useEffect(() => {
    const cached = getComponent(name);

    setData({
      loading: typeof cached === 'undefined',
      data: cached,
    });

    if (typeof cached !== 'undefined') return;

    request.open('GET', url, true);
    request.send(null);
  }, [retry]);

  return data;
};

export { useRemote };
