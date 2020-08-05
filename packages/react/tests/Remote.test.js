jest.mock('../src/use-remote.js');

import React from 'react';
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerDependencies, removeModule } from '@remote-components/core';
import { Remote } from '../src/Remote';
import DUMMY_RES from './mocks/dummy';
import WRONG_RES from './mocks/wrong';
import BROKEN_RES from './mocks/broken';


registerDependencies({
  react: React,
});

const server = setupServer(
  rest.get('http://dummy.com/component.js', (req, res, ctx) => {
    return res(ctx.delay(100), ctx.status(200), ctx.text(DUMMY_RES));
  }),
  rest.get('http://dummy.com/error.js', (req, res, ctx) => {
    return res(ctx.delay(100), ctx.status(500));
  }),
  rest.get('http://dummy.com/wrong.js', (req, res, ctx) => {
    return res(ctx.delay(100), ctx.status(200), ctx.text(WRONG_RES));
  }),
  rest.get('http://dummy.com/broken.js', (req, res, ctx) => {
    return res(ctx.delay(100), ctx.status(200), ctx.text(BROKEN_RES));
  }),
);

beforeEach(() => {
  removeModule('http://dummy.com/component.js');
  removeModule('http://dummy.com/wrong.js');
});

beforeAll(() => {
  // jest.spyOn(console, 'error').mockImplementation(jest.fn());
  server.listen();
});

afterAll(() => {
  // jest.spyOn(console, 'error').mockRestore();
  server.close();
});

test('Should render Loading component', async () => {
  const Dummy = Remote({
    url: 'http://dummy.com/component.js',
    Loading: () => <h1 data-testid="loading">Loading...</h1>,
  });

  render(<Dummy description="dummy" />);

  expect(screen.findByText(/Loading/)).toBeTruthy();
});

test('Should render remote', async () => {
  const Dummy = Remote({
    url: 'dummy',
    Loading: () => <h1 data-testid="loading">Loading...</h1>,
  });

  render(<Dummy description="dummy" />);

  expect(screen.findByText(/Loading/)).toBeTruthy();

  await waitFor(() => [
    // expect(screen.queryByText(/Loading/)).not.toBeInTheDocument(),
    expect(screen.queryByText(/dummy/)).toBeInTheDocument(),
  ]);

  expect(screen.getByText(/dummy/)).toBeTruthy();
});

test('Should render Error component', async () => {
  const Dummy = Remote({
    url: 'http://dummy.com/error.js',
    Loading: () => <h1 data-testid="loading">Loading...</h1>,
    Error: () => <h1 data-testid="error">Error</h1>,
  });

  render(<Dummy description="dummy" />);

  expect(screen.findByText(/Loading/)).toBeTruthy();

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });

  expect(screen.getByText(/Error/)).toBeTruthy();
});

test('Error component should be mounted with error object', async () => {
  const Dummy = Remote({
    url: 'http://dummy.com/error.js',
    Loading: () => <h1 data-testid="loading">Loading...</h1>,
    Error: ({ error }) => <h1 data-testid="error">{error.toString()}</h1>,
  });

  render(<Dummy description="dummy" />);

  expect(screen.findByText(/Loading/)).toBeTruthy();

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });

  expect(screen.getByTestId('error')).toHaveTextContent(
    'URIError: Error while loading http://dummy.com/error.js',
  );
});

test('Error boundary should mount error component on uncaught exceptions', async () => {
  const Wrong = Remote({
    url: 'http://dummy.com/wrong.js',
    Loading: () => <h1 data-testid="loading">Loading...</h1>,
    Error: ({ error }) => {
      return <h1 data-testid="error">{error.toString()}</h1>;
    },
  });

  render(<Wrong />);

  expect(screen.findByText(/Loading/)).toBeTruthy();

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });

  const counter = screen.getByTestId('counter');

  expect(counter).toHaveTextContent('0');

  fireEvent.click(counter);

  // Error should stop propagating
  expect(screen.getByTestId('error')).toHaveTextContent('ReferenceError: LOL is not defined');
});

test('Error component should bring back to uncorrupted state', async () => {
  const Wrong = Remote({
    url: 'http://dummy.com/wrong.js',
    Loading: () => <h1 data-testid="loading">Loading...</h1>,
    Error: ({ error, reset }) => {
      return <h1 data-testid="error" onClick={reset}>{error.toString()}</h1>;
    },
  });

  render(<Wrong />);

  expect(screen.findByText(/Loading/)).toBeTruthy();

  await waitFor(() => {
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });

  const counter = screen.getByTestId('counter');

  expect(counter).toHaveTextContent('0');

  fireEvent.click(counter);

  const errorEl = screen.getByTestId('error');

  // Error should stop propagating
  expect(errorEl).toHaveTextContent('ReferenceError: LOL is not defined');

  fireEvent.click(errorEl);

  expect(screen.getByTestId('counter')).toBeInTheDocument();
});

test('Erroring component should not stop other components from rendering', async () => {
  expect.assertions(3);

  const Broken = Remote({
    url: 'http://dummy.com/broken.js',
    Loading: () => <h1 data-testid="loading">Loading...</h1>,
    Error: ({ error, reset }) => {
      expect(error).toBeInstanceOf(Error);

      return <h1 data-testid="error" onClick={reset}>{error.toString()}</h1>;
    },
  });

  const Other = () => (
    <h1 data-testId="other">Other component</h1>
  );

  render(
    <div>
      <Broken />
      <Other />
    </div>
  );

  await waitFor(() => (
    expect(screen.getByTestId('error')).toBeInTheDocument()
  ));

  expect(screen.getByTestId('other')).toBeInTheDocument();
});

test('Remote should wrap component in Provider', async () => {
  expect.assertions(2);
  
  const Provider = ({ children }) => (
    <div data-testid="provider">
      {children}
    </div>
  );

  const WithProvider = Remote({
    url: 'http://dummy.com/component.js',
    Provider,
  });

  render(
    <WithProvider description="dummy" />
  );

  await waitFor(() => {
    expect(screen.queryByText(/dummy/)).toBeInTheDocument();
  });

  expect(screen.getByTestId('provider')).toBeInTheDocument();
});
