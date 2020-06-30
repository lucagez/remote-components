import React from 'react';
import ReactDOM from 'react-dom';

// window.oldEval = (0, eval);

// window.eval = (source) => {
//   console.log('CALLING');
//   return window.oldEval(source);
// }

import 'systemjs/dist/system';

import { Remote, registerDependencies, remoteImport } from '../dist/remote.cjs';
import 'systemjs/dist/extras/amd';
import 'systemjs/dist/extras/named-register';


System.import('https://unpkg.com/moment@2.27.0/moment.js').then(res => {
  console.log('SYSTEM:', res.default());
})

registerDependencies({
  'react': React,
});

const versions = [
  '1.0.0',
  '0.10.2',
  '0.10.1',
  '0.9.0',
  '0.8.0',
  '0.7.3',
  '0.7.2',
  '0.7.1',
  '0.7.0',
  '0.6.1',
  '0.6.0',
  '0.5.16',
  '0.5.15',
  '0.5.14',
  '0.5.13',
  '0.5.12',
  '0.5.11',
  '0.5.10',
  '0.5.9',
  '0.5.8',
  '0.5.7',
  '0.5.6',
  '0.5.5',
  '0.5.4',
  '0.5.3',
  '0.5.2',
  '0.5.1',
  '0.5.0',
].map(version => `http://unpkg.com/p5@${version}/lib/p5.js`)

// let c_worker = 0;
// console.time('WORKER');
// for (const version of versions) {
//   remoteImport(version, {
//     onError: () => {},
//     onDone: (source) => {
//       if (c_worker >= versions.length - 1) {
//         console.timeEnd('WORKER');
//       }
  
//       c_worker++;
//       // eval(source);
//     }
//   })
// }

// let c_xhr = 0;
// console.time('XHR');
// for (const version of versions) {
//   const request = new XMLHttpRequest();

//   request.onreadystatechange = () => {
//     if (request.readyState !== 4) return;
//     if (request.status !== 200) return;

//     if (c_xhr >= versions.length - 1) {
//       console.timeEnd('XHR');
//     }

//     c_xhr++;
//     // eval(request.responseText);
//   };

//   request.onerror = () => {};

//   request.open('GET', version, true);
//   request.send(null);
// }

const Gooey = Remote({
  name: 'dummy',
  dependencies: {
    'react': React,
  },
  url: 'http://localhost:5000/dummy/dist/dummy.umd.js',
  Loading: () => <h1>Loading</h1>,
  Error: ({ error, reset }) => <h1 onClick={reset}>{error.toString()}</h1>,
  timeout: 2000,
  retries: 1,
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
