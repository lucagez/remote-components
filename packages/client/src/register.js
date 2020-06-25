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
  return REGISTRY.delete(dependency);
};

const hasDependency = (dependency) => {
  return REGISTRY.has(dependency);
};

const getDependency = (dependency) => {
  return REGISTRY.get(dependency);
};

export {
  registerDependencies,
  removeDependency,
  getDependency,
  hasDependency,
  registerComponent,
  removeComponent,
  getComponent,
};
