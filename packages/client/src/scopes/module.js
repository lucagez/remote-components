import { registerComponent } from './components';

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
const createModule = (resolution, _exports = {}) => {
  // TODO: move registerComponent inside contextify function => contain side-effects
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

export { createModule };
