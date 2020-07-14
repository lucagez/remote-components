import { url as makeUrl } from '../utils/url';

const legacyFetch = ({ url: path, base }) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  const error = new URIError(`Error while loading ${path}`);
  const url = makeUrl(path, base);

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      resolve(request.responseText);
    } else {
      reject(error);
    }
  };

  request.onerror = () => reject(error);

  request.open('GET', url.href, true);
  request.send(null);
});

export { legacyFetch };
