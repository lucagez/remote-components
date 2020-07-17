import { SCOPE, createScope, createModule, registerModule } from './scopes';

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
  const _module = createModule();
  const { register, _require } = createScope(SCOPE, false);

  /**
   * This is acting as a scoped register
   * as the main registry is cloned (no global overrides).
   * Therefore, every component can have
   * a completely unique scope with different versions
   * of the same dependency.
   * 
   * TODO: register can also be an async function.
   * Therefore, dependecies could potentially be lazy loaded
   */
  register(dependencies);
  registerModule(resolution, _module.exports);

  return new Function('module', 'exports', 'require', source)(
    _module,
    _module.exports,
    _require,
  );
};

export { contextify };
