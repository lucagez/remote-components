import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { remoteImport, promisify } from '../src/import';
import { COMPONENTS_SCOPE } from '../src/scopes/components';

const _import = promisify(remoteImport);

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

    await _import({
      url: 'http://mocked.com',
    });
  } catch {}
});

test('Should return registered module', async () => {
  expect.assertions(2);

  const _module = await _import({
    url: DUMMY_URL,
  });

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

    const _moduleA = await _import({
      url: 'http://mocked.com',
    });

    expect(_moduleA).toBeInstanceOf(Object);
    expect(_moduleA.default).toBe('dummy');

    const _moduleB = await _import({
      url: 'http://mocked.com',
    });

    expect(_moduleB).toBeInstanceOf(Object);
    expect(_moduleB.default).toBe('dummy');

    expect(_moduleA).toBe(_moduleB);
  } catch {}
});

test('Should work with standard .then syntax', (done) => {
  expect.assertions(2);

  _import({
    url: DUMMY_URL,
  })
    .then(_module => {
      expect(_module).toBeInstanceOf(Object);
      expect(_module.default).toBe('dummy');

      done();
    });
});

test('Should work with standard .catch syntax', (done) => {
  expect.assertions(1);

  _import({
    url: ERR_URL,
  })
    .then(() => {
      done.fail()
    })
    .catch((error) => {
      expect(error).toBeInstanceOf(Error);

      done();
    });
});

