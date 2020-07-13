import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { legacyFetch } from '../src/fetch';

const DUMMY_URL = 'http://dummy.com';
const DUMMY_RES = `
module.exports = {
  Component: () => console.log('DUMMY'),
  name: 'dummy',
}
`;
const ERR_URL = 'http://err.com'


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
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

test('Should fetch source', async () => {
  const source = await legacyFetch(DUMMY_URL);

  expect(source).toBe(DUMMY_RES);
});

test('Should throw on server error', () => {
  return expect(legacyFetch(ERR_URL))
    .rejects
    .toThrow();
});

test('Should return URI error on fetch error', async done => {
  expect.assertions(2);

  try {
    await legacyFetch(ERR_URL);
  } catch (error) {
    expect(error).toBeInstanceOf(URIError);
    expect(error.toString()).toBe(`URIError: Error while loading ${ERR_URL}`);

    done();
  }
});
