import { useState, useLayoutEffect } from 'react';
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
  const [data, setData] = useState(undefined);
  const [retry, setRetry] = useState(retries);

  useLayoutEffect(() => {
    const head = document.querySelector('head');
    const script = document.createElement('script');

    script.setAttribute('src', url);
    script.setAttribute('type', 'text/javascript');

    script.addEventListener('load', () => {
      setData(getComponent(name));
    });

    script.addEventListener('error', (event) => {
      setTimeout(() => {
        if (retry) setRetry(retry - 1);
        removeComponent(name);
      }, timeout);
      
      head.removeChild(script);
      setData(new URIError(`Error while loading: ${event.target.src}`));
    });


    head.appendChild(script);
  }, [retry]);

  if (data instanceof Error) {
    return { error: data };
  }

  if (typeof data === 'undefined') {
    return { loading: true };
  }

  return { data };
};

export { useRemote };
