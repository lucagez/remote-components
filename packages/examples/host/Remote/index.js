import React, { useState } from 'react';

const Counter = () => {
  const [state, setState] = useState(0);

  return (
    <button onClick={() => setState(state + 1)}>🦄 REMOTE {state} times</button>
  );
};

export default () => Counter;
