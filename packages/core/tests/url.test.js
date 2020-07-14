import { url } from '../src/utils/url';

test('Should throw on malformed url', async () => {
  expect(() => url('malformed')).toThrow();
});

test('Should show args that led to failure', async () => {
  expect.assertions(2);  

  try {
    url('malformed', 'malformed-base');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.toString()).toBe(`Error: new URL('malformed', 'malformed-base') is not a valid URL`);
  }
});

test('Should return URL object', async () => {
  expect.assertions(2);  

  try {
    const target = url('http://url.com');

    expect(target).toBeInstanceOf(URL);
    expect(target.href).toBe('http://url.com/');
  } catch {}
});

test('Should return URL object when correct base', async () => {
  expect.assertions(2);  

  try {
    const target = url('path.js', 'http://url.com');

    expect(target).toBeInstanceOf(URL);
    expect(target.href).toBe('http://url.com/path.js');
  } catch {}
});
