import React from 'react';
import ReactDOM from 'react-dom';
import { Remote, registerDependencies } from '../dist/remote.esm';

registerDependencies({
  'react': React,
});

const Gooey = Remote({
  name: 'dummy',
  url: 'http://localhost:5000/dummy/dist/dummy.js',
});

const App = () => {
  return (
    <>
      <h1>App</h1>
      <Gooey />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
