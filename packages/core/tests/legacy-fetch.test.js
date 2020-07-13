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


const server = setupServer(
  rest.get(DUMMY_URL, (_, res, ctx) => {
    return res(
      ctx.delay(10),
      ctx.status(200),
      ctx.text(DUMMY_RES),
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
