import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { legacyFetch } from '../src/fetch';

const DUMMY_URL = 'http://dummy.com/';
const DUMMY_RES = `
module.exports = {
  Component: () => console.log('DUMMY'),
  name: 'dummy',
}
`;
const ERR_URL = 'http://err.com/'

const server = setupServer(
  rest.get(DUMMY_URL, (_, res, ctx) => {
    return res(
      ctx.delay(10),
      ctx.status(200),
      ctx.text(DUMMY_RES),
    );
  }),
  rest.get(ERR_URL, (_, res, ctx) => {
    return res(
      ctx.delay(10),
      ctx.status(500),
    );
  }),
  rest.get('http://localhost/dummy.js', (_, res, ctx) => {
    return res(
      ctx.delay(10),
      ctx.status(200),
      ctx.text(DUMMY_RES),
    );
  }),
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('Should fetch source', (done) => {
  expect.assertions(1);

  legacyFetch({
    url: DUMMY_URL,
    onDone: source => {
      expect(source).toBe(DUMMY_RES);
      done();
    },
    onError: () => {
      done.fail();
    }
  });
});

test('Should throw on server error', (done) => {
  expect.assertions(2);

  const spy = jest.fn();

  legacyFetch({
    url: ERR_URL,
    onDone: () => {
      spy();
      done.fail();
    },
    onError: (error) => {
      expect(error).toBeInstanceOf(Error);
      done();
    },
  });

  expect(spy).not.toBeCalled();
});

test('Should return URI error on fetch error', async done => {
  expect.assertions(3);

  const spy = jest.fn();

  legacyFetch({
    url: ERR_URL,
    onDone: () => {
      spy();
      done.fail();
    },
    onError: (error) => {
      expect(error).toBeInstanceOf(URIError);
      expect(error.toString()).toBe(`URIError: Error while loading ${ERR_URL}`);

      done();
    },
  });

  expect(spy).not.toBeCalled();
});

test('Should fetch source on relative url', (done) => {
  expect.assertions(1);

  legacyFetch({
    url: 'dummy.js',
    relative: true,
    onDone: source => {
      expect(source).toBe(DUMMY_RES);
      done();
    },
    onError: () => {
      done.fail();
    }
  });
});

test('Should fetch source with custom base url', (done) => {
  expect.assertions(1);

  legacyFetch({
    url: 'dummy.js',
    base: 'http://localhost',
    onDone: source => {
      expect(source).toBe(DUMMY_RES);
      done();
    },
    onError: () => {
      done.fail();
    }
  });
});
