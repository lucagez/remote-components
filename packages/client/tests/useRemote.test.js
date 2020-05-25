import { renderHook, act } from '@testing-library/react-hooks';
import { useRemote } from '../src/useRemote';

import 'systemjs/dist/system';
import 'systemjs/dist/extras/named-register';
import 'systemjs/dist/extras/amd';

const dummyComponent = `
  define([], function() {
    return () => "TEST COMPONENT";
  });
`;


test('should fetch component', async () => {
  System.import = (url) =>
    new Promise((resolve) => setTimeout(() => resolve({ default: dummyComponent }), 10));

  const { result, waitForNextUpdate } = renderHook(() =>
    useRemote('https://test.com/component'),
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(undefined);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(dummyComponent);
});

test('should return error on network failures', async () => {
  const error = new Error('ERROR');

  System.import = (url) =>
    new Promise((_, reject) => setTimeout(() => reject(error), 10));

  const { result, waitForNextUpdate } = renderHook(() =>
    useRemote('https://test.com/component', {
      timeout: 100,
    }),
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(undefined);
  expect(result.current.error).toBe(error);
  expect(result.current.data).toBe(undefined);
});

test('should retry n times after failure', async () => {
  const error = new Error('ERROR');

  System.import = (url) =>
    new Promise((_, reject) => setTimeout(() => reject(error), 10));

  const { result, waitForNextUpdate, rerender } = renderHook(() =>
    useRemote('https://test.com/component', {
      timeout: 10,
      retries: 5,
    }),
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.error).toBe(error);

  await waitForNextUpdate();

  expect(result.current.error).toBe(error);

  await waitForNextUpdate();

  expect(result.current.error).toBe(error);

  await waitForNextUpdate();

  expect(result.current.error).toBe(error);

  await waitForNextUpdate();

  expect(result.current.error).toBe(error);
});
