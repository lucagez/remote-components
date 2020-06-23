import React from 'react';
import ReactDOM from 'react-dom';
import 'requirejs/require';

import { Remote, registerDependencies } from '../dist/remote.esm';

registerDependencies({
  'react': React,
});

const Gooey = Remote({
  name: 'dummy',
  url: 'http://localhost:5000/dummy/dist/dummy.js',
  Error: ({ error }) => <h1>{error.toString()}</h1>,
  timeout: 2000,
  retries: 10,
});

const App = () => {
  return (
    <>
      <h1>App</h1>
      <Gooey description={'ciao'} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
