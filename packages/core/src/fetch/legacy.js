import { url as makeUrl } from '../utils/url';
import { noop } from '../utils/noop';

const legacyFetch = ({
  url,
  base,
  relative,
  onDone = noop,
  onError = noop,
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

    request.onreadystatechange = null;
  };

  request.onerror = () => onError(error);

  request.open('GET', target.href, true);
  request.send(null);
};

export { legacyFetch };
