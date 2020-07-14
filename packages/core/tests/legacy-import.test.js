import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { COMPONENTS_SCOPE, getComponent } from '../src/scopes/components';
import { remoteImport } from '../src/import';

const DUMMY_URL = 'http://dummy.com';
const DUMMY_RES = `
  module.exports = 'dummy'
`;
const ERR_URL = 'http://err.com';

const server = setupServer(
  rest.get(DUMMY_URL, (_, res, ctx) => {
    return res(ctx.delay(10), ctx.status(200), ctx.text(DUMMY_RES));
  }),
  rest.get(ERR_URL, (_, res, ctx) => {
    return res(ctx.delay(10), ctx.status(500));
  }),
);

beforeEach(() => {
  COMPONENTS_SCOPE.clear();
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('Should reach network layer if module is not registered', async () => {
  expect.assertions(1);

  try {
    server.use(
      rest.get('http://mocked.com', (_, res, ctx) => {
        expect(ctx).toBeTruthy();

        return res(ctx.delay(10), ctx.status(200), ctx.text(DUMMY_RES));
      }),
    );

    await remoteImport({ url: 'http://mocked.com' });
  } catch {}
});

test('Should return registered module', async () => {
  const _module = await remoteImport({ url: DUMMY_URL });

  expect(_module).toBeInstanceOf(Object);
  expect(_module.default).toBe('dummy');
});

test('Should not reach network layer when module is already registered', async () => {
  expect.assertions(6);

  try {
    server.use(
      rest.get('http://mocked.com', (_, res, ctx) => {
        expect(ctx).toBeTruthy();

        return res(ctx.delay(10), ctx.status(200), ctx.text(DUMMY_RES));
      }),
    );

    const _moduleA = await remoteImport({ url: 'http://mocked.com' });

    expect(_moduleA).toBeInstanceOf(Object);
    expect(_moduleA.default).toBe('dummy');

    const _moduleB = await remoteImport({ url: 'http://mocked.com' });

    expect(_moduleB).toBeInstanceOf(Object);
    expect(_moduleB.default).toBe('dummy');

    expect(_moduleA).toBe(_moduleB);
  } catch {}
});

test('Should forward dependencies to contextify', async () => {
  expect.assertions(3);

  try {
    server.use(
      rest.get('http://mocked.com', (_, res, ctx) => {
        expect(ctx).toBeTruthy();

        return res(
          ctx.delay(10),
          ctx.status(200),
          ctx.text(
            `
              module.exports = require('dummy');
            `,
          ),
        );
      }),
    );

    const _module = await remoteImport({
      url: 'http://mocked.com',
      dependencies: {
        dummy: 42,
      },
    });

    expect(_module).toBeInstanceOf(Object);
    expect(_module.default).toBe(42);
  } catch {}
});

test('Should register module in main scope', async () => {
  expect.assertions(3);

  const _module = await remoteImport({
    url: DUMMY_URL,
  });

  expect(_module).toBeInstanceOf(Object);
  expect(_module.default).toBe('dummy');

  expect(getComponent(DUMMY_URL).default).toBe('dummy');
});

test('Should throw on network failure and unknown component', async () => {
  expect.assertions(1);

  try {
    await remoteImport({ url: ERR_URL });
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});
