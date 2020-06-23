import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useRemote } from '../src/useRemote';

import 'expect-puppeteer';

/**
 * Testing strategy:
 * - unit test remote -> mocking useRemote
 * - puppeteer environment for useRemote
 * - puppeteer environment for remote
 * - register unit test
 */

const server = setupServer(
  rest.get('http://dummy.com/component.js', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.text(`
        module.exports = {
          Component: () => console.log('DUMMY'),
          name: 'dummy',
        }
      `),
    );
  }),
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('Should fetch and evaluate source', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useRemote({
      url: 'http://dummy.com/component.js',
      name: 'dummy',
    }),
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(undefined);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data.toString()).toBe(`() => console.log('DUMMY')`);
});

test('should return error on network failures', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useRemote('http://nocomponent.com/nothing.js', {
      timeout: 100,
    }),
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(undefined);
  expect(result.current.error).toBeInstanceOf(Error);
  expect(result.current.data).toBe(undefined);
});

// test('should retry n times after failure', async () => {
//   const { result, waitForNextUpdate } = renderHook(() =>
//     useRemote('http://nocomponent.com/nothing.js', {
//       timeout: 10,
//       retries: 5,
//     }),
//   );

//   expect(result.current.loading).toBe(true);
//   expect(result.current.error).toBe(undefined);
//   expect(result.current.data).toBe(undefined);

//   await waitForNextUpdate();

//   expect(result.current.error).toBeInstanceOf(Error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBeInstanceOf(Error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBeInstanceOf(Error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBeInstanceOf(Error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBeInstanceOf(Error);
// });
