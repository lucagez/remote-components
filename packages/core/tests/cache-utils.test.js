import {
  clearCache,
  clearEntries,
  DEFAULT_CACHE_NAME,
} from '../src/utils/cache';
import { remotes } from '../src/remotes';

const DUMMY_URL = 'http://dummy.com/';
const DUMMY_RES = `
  module.exports = 'dummy';
`;

global.fetch = jest.fn();

const matchEntry = (entry) => {
  return caches.open(DEFAULT_CACHE_NAME).then(
    cache => cache.match(entry),
  );
};

beforeEach(async () => {
  await caches.delete(DEFAULT_CACHE_NAME);
});

afterEach(() => {
  fetch.mockRestore();
});

test('Cache name should be equal to current cache', () => {
  expect(DEFAULT_CACHE_NAME).toBe('__REMOTE_COMPONENTS__v1');
});

test('Should clear default cache', async () => {
  fetch.mockImplementation(() => Promise.resolve(new Response(DUMMY_RES)));

  expect(await matchEntry(DUMMY_URL)).toBeFalsy();

  await new Promise((resolve) =>
    remotes.import({
      url: DUMMY_URL,
      cacheStrategy: 'rerender',
      onDone: resolve,
    }),
  );

  expect(await matchEntry(DUMMY_URL)).toBeTruthy();

  await clearCache();

  expect(await matchEntry(DUMMY_URL)).toBeFalsy();
});

test('Should clear specific entry', async () => {
  fetch.mockImplementation(() => Promise.resolve(new Response(DUMMY_RES)));

  expect(await matchEntry(DUMMY_URL)).toBeFalsy();
  expect(await matchEntry('http://other.com/')).toBeFalsy();

  await new Promise((resolve) =>
    remotes.import({
      url: 'http://dummy.com',
      cacheStrategy: 'rerender',
      onDone: resolve,
    }),
  );

  await new Promise((resolve) =>
    remotes.import({
      url: 'http://other.com',
      cacheStrategy: 'rerender',
      onDone: resolve,
    }),
  );

  expect(await matchEntry(DUMMY_URL)).toBeTruthy();
  expect(await matchEntry('http://other.com/')).toBeTruthy();

  await clearEntries([DUMMY_URL]);

  expect(await matchEntry(DUMMY_URL)).toBeFalsy();
  expect(await matchEntry('http://other.com/')).toBeTruthy();
});
