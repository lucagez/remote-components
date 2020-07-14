import {
  getComponent,
  registerComponent,
  hasComponent,
  removeComponent,
  COMPONENTS_SCOPE,
} from '../src/scopes/components';

beforeEach(() => {
  COMPONENTS_SCOPE.clear();
});

test('Utilities should not throw', async () => {
  expect(() => getComponent('comp')).not.toThrow();
  expect(() => registerComponent('comp', 1)).not.toThrow();
  expect(() => hasComponent('comp')).not.toThrow();
  expect(() => removeComponent('comp')).not.toThrow();
});

test('registerComponent should register component', async () => {
  registerComponent('comp', 123);

  expect(COMPONENTS_SCOPE.has('comp')).toBe(true);
});

test('hasComponent should check component is in registry', async () => {
  registerComponent('comp', 123);

  expect(hasComponent('comp')).toBe(true);
  expect(hasComponent('non-existent')).toBe(false);
});

test('getComponent should retrieve component', async () => {
  registerComponent('comp', 123);

  expect(getComponent('comp')).toBe(123);
  expect(getComponent('non-existent')).toBe(undefined);
});

test('removeComponent should remove component from registry', async () => {
  registerComponent('comp', 123);
  removeComponent('comp');

  expect(hasComponent('comp')).toBe(false);
});
