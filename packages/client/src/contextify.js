import { registerComponent, getDependency, hasDependency } from './register';

/**
 * Contextifying module, exports, require.
 * Necessary to keep interoperability
 * with other dynamic loaders that are
 * already polluting the global namespace:
 * - requirejs
 * - systemjs
 * - __webpack_require__ 
 * - parcelRequire
 */
const _module = (resolution) => ({
  get exports() {
    return { resolution };
  },
  set exports(value) {
    registerComponent(resolution, value);
  },
});

/**
 * require.
 *
 * Global patch to allow CommonJS and UMD imports.
 * Unfortunately using native import syntax is not
 * possible in order to keep IE compatibility
 *
 * @param {string} dependency
 */
const _require = (dependency) => {
  if (!hasDependency(dependency)) {
    throw new Error(`Attempting to require '${dependency}' without previous registration.`);
  }

  return getDependency(dependency);
};

/**
 * Contextifying module, exports, require.
 * Necessary to keep interoperability
 * with other dynamic loaders that are
 * already polluting the global namespace:
 * - requirejs
 * - systemjs
 * - __webpack_require__ 
 * - parcelRequire
 * 
 * This way, source can be evaluated and require
 * registered modules without having to store
 * variables in the `window` object and avoid breaking
 * compatibility with standard js formats (CommonJS and UMD).
 */
const contextify = (resolution, source) => {
  const contextifiedModule = _module(resolution);

  (new Function('module', 'exports', 'require', source))(
    contextifiedModule,
    contextifiedModule.exports,
    _require,
  );
};

export {
  contextify,
};
