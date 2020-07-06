import { SCOPE, createScope, createModule } from './scopes';

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
const contextify = (resolution, source, dependencies) => {
  const _module = createModule(resolution);
  const { register, _require } = createScope(SCOPE);

  /**
   * This is acting as a scoped register
   * as the main registry is cloned (no global overrides).
   * Therefore, every component can have
   * a completely unique scope with different versions
   * of the same dependency.
   */
  register(dependencies);
  // TODO: move registerComponent here

  new Function('module', 'exports', 'require', source)(
    _module,
    _module.exports,
    _require,
  );
};

export { contextify };
