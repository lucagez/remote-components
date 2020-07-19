const MODULES_SCOPE = new Map();

/**
 * CRUD utilities to interact with local SCOPE
 * without exposing main registry directly.
 */
const getModule = (_module) => MODULES_SCOPE.get(_module);

const registerModule = (_module, value) => MODULES_SCOPE.set(_module, value);

const hasModule = (_module) => MODULES_SCOPE.has(_module);

const removeModule = (_module) => MODULES_SCOPE.delete(_module);

export {
  getModule,
  registerModule,
  hasModule,
  removeModule,
  MODULES_SCOPE,
};
