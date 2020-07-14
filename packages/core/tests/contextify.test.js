import { contextify } from '../src/contextify';
import { SCOPE, registerDependencies } from '../src/scopes/dependencies';
import { getComponent, COMPONENTS_SCOPE } from '../src/scopes/components';

beforeEach(() => {
  COMPONENTS_SCOPE.clear();
  SCOPE.clear();
});

test('Should parse valid javascript without crashing', async () => {
  const source = '() => console.log(42);';

  try {
    contextify('test', source, {});
  } catch {}
});

test('Should throw when parsing invalid javascript', async () => {
  expect.assertions(1);

  const source = '() > console.log(42);';

  try {
    contextify('test', source, {});
  } catch(error) {
    expect(error).toBeInstanceOf(Error);
  }
});

test('Main registry (SCOPE) should be unaccessible from contextified module', async () => {
  expect.assertions(2);

  const source = 'console.log(SCOPE);';

  try {
    contextify('test', source, {});
  } catch(error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.toString()).toMatch('SCOPE is not defined');
  }
});

test('Parsing should happen in global context', async () => {
  expect.assertions(1);

  const source = 'return this;';

  try {
    const ctx = contextify('test', source, {});

    expect(ctx).toBe(this);
  } catch {}
});

test('Context should have access to contextified require', async () => {
  expect.assertions(1);

  const dependencies = { dummy: 42 };
  const source = `return require;`;

  try {
    const res = contextify('test', source, dependencies);

    expect(res).toBeInstanceOf(Function);
  } catch {}
});

test('Contextified require should access local registry', async () => {
  expect.assertions(1);

  const dependencies = { dummy: 42 };
  const source = `return require('dummy');`;

  try {
    const res = contextify('test', source, dependencies);

    expect(res).toBe(42);
  } catch {}
});

test('Contextified require should fail on unknown dependency', async () => {
  expect.assertions(1);

  const dependencies = { dummy: 42 };
  const source = `return require('dum');`;

  try {
    contextify('test', source, dependencies);
  } catch(error) {
    expect(error).toBeInstanceOf(Error);
  }
});

test('Context should have access to contextified module', async () => {
  expect.assertions(1);

  const dependencies = { dummy: 42 };
  const source = `return module;`;

  try {
    const res = contextify('test', source, dependencies);

    expect(res).toBeInstanceOf(Object);
  } catch {}
});

test('Context should have access to contextified exports', async () => {
  expect.assertions(1);

  const dependencies = { dummy: 42 };
  const source = `return exports;`;

  try {
    const res = contextify('test', source, dependencies);

    expect(res).toBeInstanceOf(Object);
  } catch {}
});

test('Context exports should be accessible from module', async () => {
  expect.assertions(1);

  const dependencies = { dummy: 42 };
  const source = `return module;`;

  try {
    const res = contextify('test', source, dependencies);

    expect(res.exports).toBeInstanceOf(Object);
  } catch {}
});

test('Context should be able to export module', async () => {
  expect.assertions(2);

  const source = `exports.prop = 42;`;

  try {
    contextify('test', source, {});

    expect(getComponent('test')).toBeInstanceOf(Object);
    expect(getComponent('test').prop).toBe(42);
  } catch {}
});

test('Context should be able to export modules', async () => {
  expect.assertions(3);

  const source = `
    exports.propA = 42;
    exports.propB = 3.1415;
  `;

  try {
    contextify('test', source, {});

    expect(getComponent('test')).toBeInstanceOf(Object);
    expect(getComponent('test').propA).toBe(42);
    expect(getComponent('test').propB).toBe(42);
  } catch {}
});


test('Context should be able to export default', async () => {
  expect.assertions(2);

  const source = `
    module.exports = 42;
  `;

  try {
    contextify('test', source, {});

    expect(getComponent('test')).toBeInstanceOf(Object);
    expect(getComponent('test').default).toBe(42);
  } catch {}
});

test('Exports should be able to access required modules', async () => {
  expect.assertions(2);

  const dependencies = { dummy: 42 };
  const source = `
    module.exports = require('dummy');
  `;

  try {
    contextify('test', source, dependencies);

    expect(getComponent('test')).toBeInstanceOf(Object);
    expect(getComponent('test').default).toBe(42);
  } catch {}
});

test('Context should rely on scoped registry', async () => {
  expect.assertions(2);

  registerDependencies({
    dummy: 'PARENT',
  });

  const dependencies = { dummy: 'CHILD' };
  const source = `
    module.exports = require('dummy');
  `;

  try {
    contextify('test', source, dependencies);

    expect(getComponent('test')).toBeInstanceOf(Object);
    expect(getComponent('test').default).toBe('CHILD');
  } catch {}
});
