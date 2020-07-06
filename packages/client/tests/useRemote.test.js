import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useRemote } from '../src/use-remote';

import 'expect-puppeteer';

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
  rest.get('http://dummy.com/wrong.js', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.text(`
        module.exports =
          Component: () => console.log('DUMMY'),
          name: 'wrong',
        }
      `),
    );
  }),
  rest.get('http://nocomponent.com/nothing.js', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(404),
      ctx.json({
        errorMessage: 'No component',
      }),
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
  expect(result.current.data.default.Component.toString()).toBe(
    `() => console.log('DUMMY')`,
  );
});

test('should return uri-error on network failures', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useRemote({
      name: 'nocomp',
      url: 'http://nocomponent.com/nothing.js',
    }),
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(undefined);
  expect(result.current.error).toBeInstanceOf(URIError);
  expect(result.current.data).toBe(undefined);

  expect(result.current.error.toString()).toBe(
    `URIError: Error while loading http://nocomponent.com/nothing.js`,
  );
});

test('should return evaluation-error on parsing failures', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useRemote({
      name: 'wrong',
      url: 'http://dummy.com/wrong.js',
    }),
  );

  await waitForNextUpdate();

  expect(result.current.error).toBeInstanceOf(Error);
  expect(result.current.error.toString()).toBe(
    `SyntaxError: Unexpected token ':'`,
  );
});

test('should retry n times after failure', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useRemote({
      url: 'http://nocomponent.com/nothing.js',
      name: 'nothing',
      timeout: 10,
      retries: 2,
    }),
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.error).toBeInstanceOf(URIError);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(true);

  await waitForNextUpdate();

  expect(result.current.error).toBeInstanceOf(URIError);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(true);

  await waitForNextUpdate();

  expect(result.current.error).toBeInstanceOf(URIError);
});
