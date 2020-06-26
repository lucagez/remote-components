/**
 * TODO: split register.js in 2 different domains:
 * - Dependencies
 * - Components
 */


const createScope = (SCOPE) => {
  const scope = new Map(SCOPE);

  return {
    scope,

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
    register: (dependencies) => {
      for (const [key, value] of Object.entries(dependencies)) {
        // if (scope.has(key)) {
        //   throw new Error(`Attempting registry override on: ${key}`);
        // }

        scope.set(key, value);
      }
    },

    /**
     * require.
     *
     * Global patch to allow CommonJS and UMD imports.
     * Unfortunately using native import syntax is not
     * possible in order to keep IE compatibility
     *
     * @param {string} dependency
     */
    _require: (dependency) => {
      if (!scope.has(dependency)) {
        throw new Error(
          `Attempting to require '${dependency}' without previous registration.`,
        );
      }

      return scope.get(dependency);
    },

    /**
     * CRUD utilities to interact with local SCOPE.
     */
    get: (dependency) => {
      return scope.get(dependency);
    },

    set: (dependency, value) => {
      return scope.set(dependency, value);
    },

    has: (dependency) => {
      return scope.has(dependency);
    },

    remove: (dependency) => {
      return scope.delete(dependency);
    },
  };
};

/**
 * REGISTRY interfaces.
 * Used for storing/caching dependencies and already
 * evaluated components
 */

const {
  scope: REGISTRY,
  register: registerDependencies,
} = createScope();

const {
  get: getComponent,
  set: registerComponent,
  remove: removeComponent,
} = createScope();

export {
  registerDependencies,
  registerComponent,
  removeComponent,
  getComponent,
  createScope,
  REGISTRY,
};
