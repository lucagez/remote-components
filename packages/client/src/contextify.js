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
const _module = {
  get exports() {
    return {};
  },
  set exports(value) {
    registerComponent(value.name, value.Component);
  },
};

const _exports = _module.exports;

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
const contextify = (source) => {
  (new Function('module', 'exports', 'require', source))(
    _module,
    _exports,
    _require,
  )
};

export {
  contextify,
};
