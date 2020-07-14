import {
  SCOPE,
  registerDependencies,
  createScope,
} from '../src/scopes/dependencies';

test('createScope initializes an empty scope', async () => {
  const scope = createScope();

  expect(scope.scope).toBeInstanceOf(Map);
  expect(scope.scope.size).toBe(0);

  expect(scope.register).toBeInstanceOf(Function);
  expect(scope._require).toBeInstanceOf(Function);
});

test('createScope can inherit from non-empty scope', async () => {
  const parentScope = new Map();
  parentScope.set('test', 42);

  const scope = createScope(parentScope);

  expect(scope.scope).toBeInstanceOf(Map);
  expect(scope.scope.size).toBe(1);
  expect(scope.scope.get('test')).toBe(42);
});

test('register method interact with scoped scope', async () => {
  const { scope, register } = createScope();

  expect(scope.size).toBe(0);

  register({
    testA: 42,
    testB: 3.1415,
  });

  expect(scope.size).toBe(2);
  expect(scope.get('testA')).toBe(42);
  expect(scope.get('testB')).toBe(3.1415);
});

test('Override attempt fails on strict mode', async () => {
  expect.assertions(4);

  const { scope, register } = createScope(null, true);

  expect(scope.size).toBe(0);

  register({
    testA: 42,
  });

  expect(scope.get('testA')).toBe(42);

  try {
    register({
      testA: 3.1415,
    });
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.toString()).toBe(`Error: Attempting registry override on ${`testA`}`);
  }
});

test('Override attempt succeed on local scopes', async () => {
  expect.assertions(3);

  const parentScope = new Map();
  parentScope.set('test', 42);

  const { scope, register } = createScope(parentScope, false);

  expect(scope.size).toBe(1);
  expect(scope.get('test')).toBe(42);

  try {
    register({
      test: 3.1415,
    });
    expect(scope.get('test')).toBe(3.1415);
  } catch {}
});

/**
 * This will prevent the loading of broken modules
 */
test('Require fails on unknown dependency', async () => {
  expect.assertions(3);

  const { scope, _require } = createScope(null, false);

  expect(scope.size).toBe(0);

  try {
    _require('test');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.toString()).toBe(`Error: Attempting to require '${`test`}' without previous registration.`);
  }
});

test('Require succeeds on registered dependency', async () => {
  expect.assertions(2);

  const { scope, register, _require } = createScope(null, false);

  expect(scope.size).toBe(0);

  register({
    test: 42,
  });

  try {
    const test = _require('test');

    expect(test).toBe(42);
  } catch {}
});

/**
 * TODO:
 * - test _require
 * - test global scope
 * - test global registerDependencies
 */
