import React from 'react';
import { render, waitFor, act, screen, queryByText, queryByTestId, waitForDomChange, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerDependencies, removeModule } from '@remote-components/core';
import { Remote } from '../src/Remote';
import DUMMY_RES from './mocks/dummy';

registerDependencies({
  react: React,
});

const server = setupServer(
  rest.get('http://dummy.com/component.js', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.text(DUMMY_RES),
    );
  }),
  rest.get('http://dummy.com/wrong.js', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.text(NULL),
    );
  }),
);

beforeEach(() => {
  removeModule('http://dummy.com/component.js');
  removeModule('http://dummy.com/wrong.js');
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  server.listen();
});

afterAll(() => {
  jest.spyOn(console, 'error').mockRestore();
  server.close();
});

test('Should render component', async () => {
  const Dummy = Remote({
    url: 'http://dummy.com/component.js',
    Loading: () => <h1 data-testid="loading">Loading...</h1>
  });

  render(
    <Dummy description="dummy" />
  );

  expect(screen.findByText(/Loading/)).toBeTruthy();

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });

  expect(screen.getByText(/dummy/)).toBeTruthy();
});
