import { useState, useEffect } from 'react';
import fetch from 'unfetch';
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

  useEffect(() => {
    setData({ loading: true });

    fetch(url)
      .then((res) => res.text())
      .then((source) => {

        /**
         * Indirect eval call. An indirect eval call causes the evaluation
         * of code to always be executed at global scope.
         */
        (0, eval)(source);

        setData({
          data: getComponent(name),
        });
      })
      .catch(() => {
        /**
         * TODO: customize based on error type => parsing error | network error ...
         */
        setTimeout(() => {
          if (retry) setRetry(retry - 1);
          removeComponent(name);
        }, timeout);

        setData({
          error: new URIError(`Error while loading: ${url}`)
        });
      });
  }, [retry]);

  return data;
};

export { useRemote };
