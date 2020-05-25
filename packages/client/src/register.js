
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
    window.define(key, [], function () {
      return value;
    });
  }
};

export { registerDependencies };
