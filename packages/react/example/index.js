import React from 'react';
import ReactDOM from 'react-dom';

import { Remote } from '@remote-components/react';
import { registerDependencies } from '@remote-components/core';

registerDependencies({
  react: React
})

const Dummy = Remote({
  name: 'dummy',
  dependencies: {
    'react': React,
  },
  url: 'http://localhost:5000/dummy@dev.js',
  Loading: () => <h1>Loading</h1>,
  Error: ({ error, reset }) => <h1 onClick={reset}>{error.toString()}</h1>,
  timeout: 2000,
  retries: 1,
  cacheStrategy: 'rerender',
});

const App = () => {
  return (
    <>
      <h1>App</h1>
      <Dummy description={`CIAO`} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
