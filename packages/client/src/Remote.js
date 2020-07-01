import React, { useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useRemote } from './useRemote';
import { registerDependencies } from './scopes';
import { ErrorBoundary } from './error-boundary';

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
 * @param {function} [config.Provider] - Provider Component used to wrap remote inside an explicit context if needed
 * @param {function} [config.onError] - Callback function invoked when an error is catched by the remote error boundary
 * @return {function} Remote Component
 */
const Remote = ({
  url,
  name,
  timeout,
  retries,
  dependencies = {},
  Loading: LoadingComp = () => null,
  Error: ErrorComp = () => null,
  Provider = ({ children }) => children,
  onError = () => void 0,
  // TODO: pass renderer as prop? => e.g. while mounting a component relying on
  // an old React version
}) => {
  /**
   * Reference the HOC in order to override its name,
   * undefined otherwise
   */
  function Component(props) {
    const { data = {}, loading, error } = useRemote({
      url,
      timeout,
      retries,
      dependencies,
    });
    const ref = useRef(null);
    const { default: RemoteComp } = data;
    const BoundedComp = () => (
      <Provider>
        <ErrorBoundary
          onError={onError}
          fallback={({ reset, error: fallbackError }) => {
            return <ErrorComp {...props} reset={reset} error={fallbackError} />;
          }}
        >
          <RemoteComp {...props} />
        </ErrorBoundary>
      </Provider>
    );

    const render = (Component) => {
      const Valid = React.isValidElement(Component)
        ? Component
        : React.createElement(Component, {
            ...props,
            url,
            error,
          });

      ReactDOM.render(Valid, ref.current);
    };

    useLayoutEffect(() => {
      if (typeof loading !== 'undefined') {
        render(LoadingComp);
      }

      if (typeof error !== 'undefined') {
        // TODO: add manual refetch on network errors?
        render(ErrorComp);
      }

      if (typeof RemoteComp !== 'undefined') {
        render(BoundedComp);
      }
    }, [RemoteComp, loading, error]);

    return <div ref={ref} />;
  }

  registerDependencies(dependencies);

  Component.displayName = name || 'RemoteComponent';

  return Component;
};

export { Remote };
