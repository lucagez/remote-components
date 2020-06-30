import { useState, useEffect } from 'react';
import { removeComponent, getComponent, REGISTRY, createScope } from './register';
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
 * @param {string} [config.name] - name of the remote component
 * @param {string} [config.dependencies] - Scoped dependencies.
 * @param {number} [config.timeout] - Time (ms) between retries on errors when fetching.
 * @param {number} [config.retries] - Number of retries when encountring errors while fetching components.
 */
const useRemote = ({ url, name, dependencies = {}, timeout, retries = 1 } = {}) => {
  const { _require, register } = createScope(REGISTRY);

  /**
   * This is acting as a scoped register
   * as the main registry is cloned (no global overrides).
   * Therefore, every component can have
   * a completely unique scope with different versions
   * of the same dependency.
   */
  register(dependencies);

  const use = () => {
    const [data, setData] = useState({ loading: true });
    const [retry, setRetry] = useState(retries);
  
    const onDone = (source) => {
      try {
        /**
         * Indirect eval call.
         * Evaluating source in a mocked context.
         * Providing ad-hoc module, exports and require objects.
         */
        contextify(url, source, _require);

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

  /**
   * TODO: best strategy for naming?
   */
  Object.defineProperty(use, `use${name}`, {
    value: name,
    configurable: true,
  });

  return use;
};

export { useRemote };
