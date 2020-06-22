import React, { useLayoutEffect } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
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

// describe('useRemote hook', () => {
//   // beforeAll(async () => {
//   //   await page.goto('http://localhost:5000');
//   // })

//   // it('should display "PAGE" text on page', async () => {
//   //   await expect(page).toMatch('PAGE');
//   // })

//   it('mock request', async () => {
//     const { result, waitForNextUpdate } = renderHook(() =>
//       useRemote({
//         url: 'http://dummy.com/component.js',
//         name: 'dummy',
//       }),
//     );

//     expect(result.current.loading).toBe(true);
//     expect(result.current.error).toBe(undefined);
//     expect(result.current.data).toBe(undefined);

//     await waitForNextUpdate();

//     expect(result.current.loading).toBe(undefined);
//     expect(result.current.error).toBe(undefined);
//     expect(result.current.data).toBe(dummyComponent);
//   });
// })

test('mock request', async () => {
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


// test('mock request', async () => {
//   await page.goto('tests/index.html');

//   const { result, waitForNextUpdate } = renderHook(() =>
//     useRemote({
//       url: 'http://dummy.com/component.js',
//       name: 'dummy',
//     }),
//   );

//   expect(result.current.loading).toBe(true);
//   expect(result.current.error).toBe(undefined);
//   expect(result.current.data).toBe(undefined);

//   await waitForNextUpdate();

//   // expect(result.current.loading).toBe(undefined);
//   // expect(result.current.error).toBe(undefined);
//   // expect(result.current.data).toBe(dummyComponent);
// });

// const dummyComponent = `
//   define([], function() {
//     return () => "TEST COMPONENT";
//   });
// `;

// test('should fetch component', async () => {
//   System.import = (url) =>
//     new Promise((resolve) => setTimeout(() => resolve({ default: dummyComponent }), 10));

//   const { result, waitForNextUpdate } = renderHook(() =>
//     useRemote('https://test.com/component'),
//   );

//   expect(result.current.loading).toBe(true);
//   expect(result.current.error).toBe(undefined);
//   expect(result.current.data).toBe(undefined);

//   await waitForNextUpdate();

//   expect(result.current.loading).toBe(undefined);
//   expect(result.current.error).toBe(undefined);
//   expect(result.current.data).toBe(dummyComponent);
// });

// test('should return error on network failures', async () => {
//   const error = new Error('ERROR');

//   System.import = (url) =>
//     new Promise((_, reject) => setTimeout(() => reject(error), 10));

//   const { result, waitForNextUpdate } = renderHook(() =>
//     useRemote('https://test.com/component', {
//       timeout: 100,
//     }),
//   );

//   expect(result.current.loading).toBe(true);
//   expect(result.current.error).toBe(undefined);
//   expect(result.current.data).toBe(undefined);

//   await waitForNextUpdate();

//   expect(result.current.loading).toBe(undefined);
//   expect(result.current.error).toBe(error);
//   expect(result.current.data).toBe(undefined);
// });

// test('should retry n times after failure', async () => {
//   const error = new Error('ERROR');

//   System.import = (url) =>
//     new Promise((_, reject) => setTimeout(() => reject(error), 10));

//   const { result, waitForNextUpdate, rerender } = renderHook(() =>
//     useRemote('https://test.com/component', {
//       timeout: 10,
//       retries: 5,
//     }),
//   );

//   expect(result.current.loading).toBe(true);
//   expect(result.current.error).toBe(undefined);
//   expect(result.current.data).toBe(undefined);

//   await waitForNextUpdate();

//   expect(result.current.error).toBe(error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBe(error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBe(error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBe(error);

//   await waitForNextUpdate();

//   expect(result.current.error).toBe(error);
// });
