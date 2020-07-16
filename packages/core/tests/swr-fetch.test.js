import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { swrFetch } from '../src/fetch';
import { DEFAULT_CACHE_NAME } from '../src/utils/cache';

const DUMMY_URL = 'http://dummy.com/';
const DUMMY_RES = `
  module.exports = 'dummy';
`;
const ERR_URL = 'http://err.com/';

const spyFetch = (str, fail = false) => {
  const payload = fail ? new Error(str) : new Response(str);
  const method = fail ? 'reject' : 'resolve';
  const spy = jest.spyOn(window, 'fetch').mockImplementation(() => {
    console.log('CACTHEDDD')
    return Promise[method](payload);
  });

  return () => spy.mockRestore();
};

global.fetch = jest.fn();

beforeEach(async () => {
  await caches.delete(DEFAULT_CACHE_NAME);
});

test('Should fetch source', (done) => {
  expect.assertions(2);

  fetch.mockImplementationOnce(() => Promise.resolve(
    new Response(DUMMY_RES),
  ));

  const spy = jest.fn();

  swrFetch({
    url: DUMMY_URL,
    cacheStrategy: 'rerender',
    onError: () => {
      spy();
    },
    onDone: (source) => {
      expect(source).toBe(DUMMY_RES);
      expect(spy).not.toBeCalled();
      done();
    },
  });
});

test('Should not pollute cache before fetching', async (done) => {
  expect.assertions(2);
  fetch.mockImplementationOnce(() => Promise.resolve(
    new Response(DUMMY_RES),
  ));

  const cache = await caches.open(DEFAULT_CACHE_NAME);

  expect(await cache.match(DUMMY_URL)).toBeFalsy();

  swrFetch({
    url: DUMMY_URL,
    cacheStrategy: 'rerender',
    onDone: async () => {
      expect(await cache.match(DUMMY_URL)).toBeTruthy();

      done();
    },
  });
});

test('Should trigger onError event on failure', (done) => {
  expect.assertions(1);

  fetch.mockImplementationOnce(() => Promise.reject(
    new Error('ERR'),
  ));

  swrFetch({
    url: ERR_URL,
    cacheStrategy: 'rerender',
    onError: (error) => {
      expect(error).toBeInstanceOf(Error);

      done();
    },
    onDone: done.fail,
  });
});
