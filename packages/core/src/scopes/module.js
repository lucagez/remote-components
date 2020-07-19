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
const createModule = (_exports = {}) => ({
  get exports() {
    return _exports;
  },
  set exports(value) {
    this.exports.default = value;
  },
});

export { createModule };
