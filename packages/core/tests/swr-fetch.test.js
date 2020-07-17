import { swrFetch } from '../src/fetch';
import { DEFAULT_CACHE_NAME } from '../src/utils/cache';

const DUMMY_URL = 'http://dummy.com/';
const DUMMY_RES = `
  module.exports = 'dummy';
`;
const DUMMY_RES_A = `
  module.exports = 'dummy_A';
`;
const ERR_URL = 'http://err.com/';

global.fetch = jest.fn();

beforeEach(async () => {
  await caches.delete(DEFAULT_CACHE_NAME);
});

afterEach(() => {
  fetch.mockRestore();
});

test('Should fetch source', (done) => {
  expect.assertions(2);

  fetch.mockImplementationOnce(() => Promise.resolve(new Response(DUMMY_RES)));

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
  fetch.mockImplementationOnce(() => Promise.resolve(new Response(DUMMY_RES)));

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

  fetch.mockImplementationOnce(() => Promise.reject(new Error('ERR')));

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

/**
 * STALE
 */
describe('Stale strategy', () => {
  test('Reach network layer on unknown url', (done) => {
    expect.assertions(2);

    fetch.mockImplementationOnce(() =>
      Promise.resolve(new Response(DUMMY_RES)),
    );

    swrFetch({
      url: DUMMY_URL,
      cacheStrategy: 'stale',
      onDone: (source) => {
        expect(source).toBe(DUMMY_RES);
        expect(fetch).toBeCalledTimes(1);

        done();
      },
    });
  });

  test('Serve stale response on known url', async () => {
    expect.assertions(4);

    fetch.mockImplementation(() => Promise.resolve(new Response(DUMMY_RES)));

    const sourceA = await new Promise((resolve) =>
      swrFetch({
        url: DUMMY_URL,
        cacheStrategy: 'stale',
        onDone: resolve,
      }),
    );

    expect(sourceA).toBe(DUMMY_RES);

    const sourceB = await new Promise((resolve) =>
      swrFetch({
        url: DUMMY_URL,
        cacheStrategy: 'stale',
        onDone: resolve,
      }),
    );

    expect(sourceB).toBe(DUMMY_RES);
    expect(sourceA).toBe(sourceB);
    expect(fetch).toBeCalledTimes(1);
  });
});

/**
 * REVALIDATE
 */
describe('Revalidate strategy', () => {
  test('Reach network layer on unknown url', (done) => {
    expect.assertions(2);

    fetch.mockImplementationOnce(() =>
      Promise.resolve(new Response(DUMMY_RES)),
    );

    swrFetch({
      url: DUMMY_URL,
      cacheStrategy: 'revalidate',
      onDone: (source) => {
        expect(source).toBe(DUMMY_RES);
        expect(fetch).toBeCalledTimes(1);

        done();
      },
    });
  });

  test('Serve stale response, refetch source and update cache', async () => {
    expect.assertions(3);

    /**
     * First fetch
     */
    fetch.mockImplementationOnce(() => Promise.resolve(new Response(DUMMY_RES)));

    const sourceA = await new Promise((resolve) =>
      swrFetch({
        url: DUMMY_URL,
        cacheStrategy: 'revalidate',
        onDone: resolve,
      }),
    );

    expect(sourceA).toBe(DUMMY_RES);

    /**
     * In the meantime source has been updated to DUMMY_RES_A
     */
    fetch.mockImplementationOnce(() => Promise.resolve(new Response(DUMMY_RES_A)));

    const sourceB = await new Promise((resolve) =>
      swrFetch({
        url: DUMMY_URL,
        cacheStrategy: 'revalidate',
        onDone: resolve,
      }),
    );

    expect(sourceB).toBe(DUMMY_RES);

    const cache = await caches.open(DEFAULT_CACHE_NAME);
    const freshResponse = await cache
      .match(DUMMY_URL)
      .then(res => res.text());
      
    expect(freshResponse).toBe(DUMMY_RES_A);
  });
});


/**
 * RERENDER
 */
describe('Rerender strategy', () => {
  test('Reach network layer on unknown url', (done) => {
    expect.assertions(2);

    fetch.mockImplementationOnce(() =>
      Promise.resolve(new Response(DUMMY_RES)),
    );

    swrFetch({
      url: DUMMY_URL,
      cacheStrategy: 'rerender',
      onDone: (source) => {
        expect(source).toBe(DUMMY_RES);
        expect(fetch).toBeCalledTimes(1);

        done();
      },
    });
  });

  test('Serve stale response, refetch source, update cache and rerender with', async (done) => {
    expect.assertions(5);

    /**
     * First fetch
     */
    fetch.mockImplementationOnce(() => Promise.resolve(new Response(DUMMY_RES)));

    const sourceA = await new Promise((resolve) =>
      swrFetch({
        url: DUMMY_URL,
        cacheStrategy: 'rerender',
        onDone: resolve,
      }),
    );

    expect(sourceA).toBe(DUMMY_RES);

    /**
     * In the meantime source has been updated to DUMMY_RES_A
     */
    fetch.mockImplementation(() => Promise.resolve(new Response(DUMMY_RES_A)));

    let rerender = false;
    swrFetch({
      url: DUMMY_URL,
      cacheStrategy: 'rerender',
      onDone: async (source) => {
        if (rerender) {
          const cache = await caches.open(DEFAULT_CACHE_NAME);
          const freshResponse = await cache
            .match(DUMMY_URL)
            .then(res => res.text());
          
          // cache is revalidated
          expect(freshResponse).toBe(DUMMY_RES_A);
          expect(fetch).toBeCalledTimes(2);

          // fresh source is served back
          expect(source).toBe(DUMMY_RES_A);

          done();
        } else {
          rerender = true;

          // stale source is immediately served back
          expect(source).toBe(DUMMY_RES);
        }
      },
    });
  });
});
