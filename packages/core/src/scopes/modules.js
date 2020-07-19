const MODULES_SCOPE = new Map();

/**
 * CRUD utilities to interact with local SCOPE
 * without exposing main registry directly.
 */
const getModule = (_module) => {
  return MODULES_SCOPE.get(_module);
};

const registerModule = (_module, value) => {
  return MODULES_SCOPE.set(_module, value);
};

const hasModule = (_module) => {
  return MODULES_SCOPE.has(_module);
};

const removeModule = (_module) => {
  return MODULES_SCOPE.delete(_module);
};

export {
  getModule,
  registerModule,
  hasModule,
  removeModule,
  MODULES_SCOPE,
};
