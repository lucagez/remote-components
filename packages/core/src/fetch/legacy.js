import { url as makeUrl } from '../utils/url';

const legacyFetch = ({ url, base, relative }) => new Promise((resolve, reject) => {
  const target = makeUrl(url, base, relative);
  const error = new URIError(`Error while loading ${target.href}`);
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      resolve(request.responseText);
    } else {
      reject(error);
    }
  };

  request.onerror = () => reject(error);

  request.open('GET', target.href, true);
  request.send(null);
});

export { legacyFetch };
