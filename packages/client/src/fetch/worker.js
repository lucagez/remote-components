import inlinedWorker from './module.worker.js';

/**
 * Worker interface for fetching dependencies
 * in the background without blocking the main
 * thread.
 */
const workerFetch = (url, { onError, onDone }) => {
  const loader = new Worker(inlinedWorker, {
    type: 'module',
  });

  const handler = ({ data }) => {
    const { source, status } = data;

    if (status === 'DONE') onDone(source);
    if (status === 'ERROR') onError(new URIError(`Error while loading ${url}`));

    loader.removeEventListener('message', handler);
  };

  loader.postMessage(url);
  loader.addEventListener('message', handler);
};

export { workerFetch };
