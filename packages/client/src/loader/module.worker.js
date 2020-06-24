console.log('SERVICE')
/**
 * TODO: add better web worker loader support
 */
self.addEventListener('message', (event) => {
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status !== 200) return;

    self.postMessage({ source: request.responseText, status: 'DONE' });
  };

  request.onerror = () => self.postMessage({ source: null, status: 'ERROR' });

  request.open('GET', event.data, true);
  request.send(null);
});
