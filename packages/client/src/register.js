/**
 * REGISTRY interfaces.
 * Used for storing/caching dependencies and already
 * evaluated components
 */
const REGISTRY = new Map();
const COMPONENTS_REGISTRY = new Map();

const registerComponent = (name, Component) => {
  return COMPONENTS_REGISTRY.set(name, Component);
};

const removeComponent = (name) => {
  return COMPONENTS_REGISTRY.delete(name);
};

const getComponent = (name) => {
  return COMPONENTS_REGISTRY.get(name);
};

/**
 * Prefixing module, exports, require.
 * Necessary to keep interoperability
 * with other dynamic loaders that are
 * already polluting the global namespace:
 * - requirejs
 * - systemjs
 * - __webpack_require__ 
 * - parcelRequire
 */
window.module = {
  set exports(value) {
    registerComponent(value.name, value.Component);
  },
};

/**
 * require.
 *
 * Global patch to allow CommonJS and UMD imports.
 * Unfortunately using native import syntax is not
 * possible in order to keep IE compatibility
 *
 * @param {string} dependency
 */
window.require = (dependency) => {
  if (!REGISTRY.has(dependency)) {
    throw new Error(`Attempting to require '${dependency}' without previous registration.`);
  }

  return REGISTRY.get(dependency);
};

/**
 * registerDependencies.
 * RegisterDependencies provides a sharing layer of dependecies
 * from the host app and the remote components.
 *
 * usage:
 * ```js
 * registerDependencies({
 *   react: React,
 * });
 * ```
 *
 * @param {object} dependencies - Dependencies to register in remote components, [key]: value
 */
const registerDependencies = (dependencies) => {
  for (const [key, value] of Object.entries(dependencies)) {
    if (REGISTRY.has(key)) {
      throw new Error(`Attempting registry override on: ${key}`);
    }

    REGISTRY.set(key, value);
  }
};

/**
 * removeDependency/
 * Remove a dependency from the main REGISTRY.
 *
 * @param {string} dependency
 */
const removeDependency = (dependency) => {
  REGISTRY.delete(dependency);
};

export {
  registerDependencies,
  removeDependency,
  registerComponent,
  removeComponent,
  getComponent,
};
