import { useState, useEffect } from 'react';
// import fetch from 'unfetch';
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

    const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
      if (request.readyState !== 4) return;
      if (request.status !== 200) return;

      (0, eval)(request.responseText);

      setData({
        data: getComponent(name),
      });
    };

    request.onerror = () => {
      if (timeout && retries) {
        setTimeout(() => {
          if (retry) setRetry(retry - 1);
          removeComponent(name);
        }, timeout);
      }

      setData({
        error: new URIError(`Error while loading: ${url}`),
      });
    };

    request.open('GET', url);
    request.send();
  }, [retry]);

  return data;
};

export { useRemote };
