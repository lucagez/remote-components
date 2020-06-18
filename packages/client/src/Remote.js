import React, { useEffect } from 'react';
import { useRemote } from './useRemote';
import { registerDependencies } from './register';

/**
 * Remote Component.
 * Load a React component from a remote source.
 * 
 * Configuration:
 * ```js
 * const Component = Remote({
 *  url: 'remote.url.com/component.js',
 * });
 * ```
 * 
 * Usage:
 * ```jsx
 * // You can forward any props to the underlying component
 * <Component {...props} />
 * ``` 
 *
 * @param {object} config
 * @param {string} config.url - Remote source
 * @param {object} [config.dependencies] - Dependencies that the host should share with the remote (any import path declared as peerDependency)
 * @param {string} [config.name] - Component name used for stack traces and visualized in component tree
 * @param {number} [config.timeout] - In case of error, number of milliseconds before retrying to fetch component
 * @param {number} [config.retries] - Number of retries to fetch remote component
 * @param {function} [config.Loading] - Component rendered while fetching remote source
 * @param {function} [config.Error] - Component rendered in case of unexpected errors
 * @return {function} Remote Component
 */
const Remote = ({
  url,
  name,
  timeout,
  retries,
  dependencies = {},
  Loading = () => null,
  Error = () => null,
}) => {
  /**
   * Reference the HOC in order to override its name,
   * undefined otherwise
   */
  const Component = ({ ...props }) => {
    const { data: Comp, loading, error } = useRemote({ url, name, timeout, retries });

    useEffect(() => {
      registerDependencies(dependencies);
    }, []);

    if (typeof error !== 'undefined') {
      return <Error url={url} error={error} {...props} />;
    }

    if (typeof loading !== 'undefined') {
      return <Loading url={url} {...props} />;
    }

    return <Comp {...props} />;
  }

  Object.defineProperty(Component, 'name', {
    value: name,
    configurable: true,
  });

  return Component;
};

export { Remote };
