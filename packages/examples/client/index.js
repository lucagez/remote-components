import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Remote, registerDependencies } from '../../client/dist/remote.esm';

const Counter = () => {
  const [state, setState] = useState(0);

  return (
    <button onClick={() => setState(state + 1)}>CLICKED {state} times</button>
  );
};

const RemoteCounter = Remote({
  name: 'RemoteCounter',
  dependencies: {
    react: React,
  },
  timeout: 1000, // change prop name
  retries: 10,
  url: 'http://localhost:5000/Remote/dist/remote.umd.js',
  Loading: ({ name }) => <h1>Loading {name} component...</h1>,
  Error: ({ error, name }) => {
    return (
      <div>
        <p>
          Sorry, something went wrong while fetching <b>{name}</b> component...
        </p>
        <p
          style={{
            fontFamily: 'monospace',
            background: 'rgb(253, 236, 236)',
            color: 'rgb(239, 17, 45)',
            padding: '10px',
          }}
        >
          {error.toString()}
        </p>
      </div>
    );
  },
});

const App = () => {
  return (
    <div>
      <h1>This is a React app 🦄</h1>

      <Counter />

      <RemoteCounter name="REMOTE-COUNTER" />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
