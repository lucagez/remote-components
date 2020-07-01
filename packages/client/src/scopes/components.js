const COMPONENTS_SCOPE = new Map();

/**
 * CRUD utilities to interact with local SCOPE.
 */
const getComponent = (dependency) => {
  return COMPONENTS_SCOPE.get(dependency);
};

const registerComponent = (dependency, value) => {
  return COMPONENTS_SCOPE.set(dependency, value);
};

const hasComponent = (dependency) => {
  return COMPONENTS_SCOPE.has(dependency);
};

const removeComponent = (dependency) => {
  return COMPONENTS_SCOPE.delete(dependency);
};

export {
  getComponent,
  registerComponent,
  hasComponent,
  removeComponent,
};
