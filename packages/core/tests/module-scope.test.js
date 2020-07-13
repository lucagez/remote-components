import {
  createModule,
} from '../src/scopes/module';

test('createModule should return an object', async () => {
  const _module = createModule();

  expect(_module).toBeInstanceOf(Object);
});

test('createModule should expose exports property', async () => {
  const _module = createModule();

  expect(_module.exports).toBeInstanceOf(Object);
});

test('exports property should not be settable', async () => {
  const _module = createModule();

  expect(_module.exports).toBeInstanceOf(Object);

  _module.exports = 42;

  expect(_module.exports).toBeInstanceOf(Object);
});

test('explicitly setting exports is setting default instead', async () => {
  const _module = createModule();

  expect(_module.exports).toBeInstanceOf(Object);

  _module.exports = 42;

  expect(_module.exports).toBeInstanceOf(Object);
  expect(_module.exports.default).toBe(42);
});

test('exports properties can be freely set by modules', async () => {
  const _module = createModule();

  expect(_module.exports).toBeInstanceOf(Object);

  _module.exports.prop = 42;

  expect(_module.exports).toBeInstanceOf(Object);
  expect(_module.exports.prop).toBe(42);
});
