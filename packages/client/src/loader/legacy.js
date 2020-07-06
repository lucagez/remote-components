export const legacyImport = (url, { onError, onDone }) => {
  // TODO: check if component is already registered

  const request = new XMLHttpRequest();
  const error = new URIError(`Error while loading ${url}`);

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      onDone(request.responseText);
    } else {
      onError(error);
    }
  };

  request.onerror = () => onError(error);

  request.open('GET', url, true);
  request.send(null);
};
