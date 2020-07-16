import { url as makeUrl } from '../utils/url';

const legacyFetch = ({
  url,
  base,
  relative,
  onDone = () => void 0,
  onError = () => void 0,
}) => {
  const target = makeUrl(url, base, relative);
  const error = new URIError(`Error while loading ${target.href}`);
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      onDone(request.responseText);
    } else {
      onError(error);
    }
  };

  request.onerror = () => onError(error);

  request.open('GET', target.href, true);
  request.send(null);
};

export { legacyFetch };
