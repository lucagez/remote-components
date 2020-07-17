import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MODULES_SCOPE, getModule } from '../src/scopes/components';
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
  MODULES_SCOPE.clear();
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('Should reach network layer if module is not registered', (done) => {
  expect.assertions(1);

  try {
    server.use(
      rest.get('http://mocked.com', (_, res, ctx) => {
        expect(ctx).toBeTruthy();

        return res(ctx.delay(10), ctx.status(200), ctx.text(DUMMY_RES));
      }),
    );

    remoteImport({
      url: 'http://mocked.com',
      cacheStrategy: 'none',
      onDone: () => {
        done();
      },
    });
  } catch {}
});

test('Should return registered module', (done) => {
  expect.assertions(2);

  remoteImport({
    url: DUMMY_URL,
    cacheStrategy: 'none',
    onError: () => done.fail(),
    onDone: (_module) => {
      expect(_module).toBeInstanceOf(Object);
      expect(_module.default).toBe('dummy');

      done();
    },
  });
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

    const _moduleA = await new Promise((resolve) =>
      remoteImport({
        url: 'http://mocked.com',
        cacheStrategy: 'none',
        onDone: (_module) => resolve(_module),
      }),
    );

    expect(_moduleA).toBeInstanceOf(Object);
    expect(_moduleA.default).toBe('dummy');

    const _moduleB = await new Promise((resolve) =>
      remoteImport({
        url: 'http://mocked.com',
        cacheStrategy: 'none',
        onDone: (_module) => resolve(_module),
      }),
    );

    expect(_moduleB).toBeInstanceOf(Object);
    expect(_moduleB.default).toBe('dummy');

    expect(_moduleA).toBe(_moduleB);
  } catch {}
});

test('Should forward dependencies to contextify', (done) => {
  expect.assertions(3);

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

  remoteImport({
    url: 'http://mocked.com',
    cacheStrategy: 'none',
    dependencies: {
      dummy: 42,
    },
    onDone: (_module) => {
      expect(_module).toBeInstanceOf(Object);
      expect(_module.default).toBe(42);

      done();
    },
    onError: done.fail,
  });
});

test('Should register module in main scope', (done) => {
  expect.assertions(3);

  remoteImport({
    url: DUMMY_URL,
    cacheStrategy: 'none',
    onDone: (_module) => {
      expect(_module).toBeInstanceOf(Object);
      expect(_module.default).toBe('dummy');

      expect(getModule(DUMMY_URL).default).toBe('dummy');

      done();
    },
  });
});

test('Should throw on network failure and unknown component', (done) => {
  expect.assertions(1);

  remoteImport({
    url: ERR_URL,
    cacheStrategy: 'none',
    onError: (error) => {
      expect(error).toBeInstanceOf(Error);

      done();
    },
  });
});

test('Should import module from relative url', (done) => {
  expect.assertions(3);

  server.use(
    rest.get('http://localhost/path', (_, res, ctx) => {
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

  remoteImport({
    url: 'path',
    relative: true,
    dependencies: {
      dummy: 42,
    },
    cacheStrategy: 'none',
    onDone: (_module) => {
      expect(_module).toBeInstanceOf(Object);
      expect(_module.default).toBe(42);

      done();
    },
  });
});

test('Should import module using base url', (done) => {
  expect.assertions(3);

  server.use(
    rest.get('http://pino.com/path', (_, res, ctx) => {
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

  remoteImport({
    url: 'path',
    base: 'http://pino.com',
    dependencies: {
      dummy: 42,
    },
    cacheStrategy: 'none',
    onDone: (_module) => {
      expect(_module).toBeInstanceOf(Object);
      expect(_module.default).toBe(42);

      done();
    },
  });
});
