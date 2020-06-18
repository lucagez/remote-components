
const REGISTRY = new Map();

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

const removeDependency = (dependency) => {
  REGISTRY.delete(dependency);
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
  return REGISTRY.get(dependency);
};

export { registerDependencies, removeDependency };
