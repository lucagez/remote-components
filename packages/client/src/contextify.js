import { registerComponent } from './register';

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

// TODO: => move to scope?
const _module = (resolution, _exports = {}) => {
  registerComponent(resolution, _exports);

  return {
    get exports() {
      return _exports;
    },
    set exports(value) {
      this.exports.default = value;
    },
  };
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
const contextify = (resolution, source, scopedRequire) => {
  const contextifiedModule = _module(resolution);

  (new Function('module', 'exports', 'require', source))(
    contextifiedModule,
    contextifiedModule.exports,
    scopedRequire,
  );
};

export {
  contextify,
};
