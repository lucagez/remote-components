import {
  getModule,
  registerModule,
  hasModule,
  removeModule,
  MODULES_SCOPE,
} from '../src/scopes/components';

beforeEach(() => {
  MODULES_SCOPE.clear();
});

test('Utilities should not throw', async () => {
  expect(() => getModule('comp')).not.toThrow();
  expect(() => registerModule('comp', 1)).not.toThrow();
  expect(() => hasModule('comp')).not.toThrow();
  expect(() => removeModule('comp')).not.toThrow();
});

test('registerModule should register component', async () => {
  registerModule('comp', 123);

  expect(MODULES_SCOPE.has('comp')).toBe(true);
});

test('hasModule should check component is in registry', async () => {
  registerModule('comp', 123);

  expect(hasModule('comp')).toBe(true);
  expect(hasModule('non-existent')).toBe(false);
});

test('getModule should retrieve component', async () => {
  registerModule('comp', 123);

  expect(getModule('comp')).toBe(123);
  expect(getModule('non-existent')).toBe(undefined);
});

test('removeModule should remove component from registry', async () => {
  registerModule('comp', 123);
  removeModule('comp');

  expect(hasModule('comp')).toBe(false);
});
