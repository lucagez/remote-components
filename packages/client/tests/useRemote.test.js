import { renderHook, act } from '@testing-library/react-hooks';
import nock from 'nock';
import { useRemote } from '../src/useRemote';

import 'systemjs/dist/system';
import 'systemjs/dist/extras/named-register';
import 'systemjs/dist/extras/amd';

const dummyComponent = `
  define([], function() {
    return () => "TEST COMPONENT";
  });
`;

const scope = nock('https://test.com')
  .get('/component')
  .reply(200, dummyComponent);

test('should fetch component', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useRemote('https://test.com/component'))

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBe(undefined);
});
