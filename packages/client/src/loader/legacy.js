export const legacyImport = (url) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  const error = new URIError(`Error while loading ${url}`);

  request.onreadystatechange = () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      resolve(request.responseText);
    } else {
      reject(error);
    }
  };

  request.onerror = () => reject(error);

  request.open('GET', url, true);
  request.send(null);
});
