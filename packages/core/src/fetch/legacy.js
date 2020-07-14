import { url as makeUrl } from '../utils/url';

const legacyFetch = ({ url, base }) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  const target = makeUrl(url, base);
  const error = new URIError(`Error while loading ${target.href}`);

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
