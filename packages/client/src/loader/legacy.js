export const legacyImport = (url, { onError, onDone }) => {
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status !== 200) return;

    onDone(request.responseText);
  };

  request.onerror = () => onError(new URIError(`Error while loading ${url}`));

  request.open('GET', url, true);
  request.send(null);
};
