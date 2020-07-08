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
        if (scope.has(key)) {
          throw new Error(`Attempting registry override on: ${key}`);
        }

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
  };
};

const {
  scope: SCOPE,
  register: registerDependencies,
} = createScope();

export {
  SCOPE,
  registerDependencies,
  createScope,
};
