import { swrImport, legacyImport } from './loader';
import { modern } from './features';
import { hasComponent, getComponent, registerComponent } from './scopes';
import { contextify } from './contextify';

const remoteImport = async ({
  url,
  cacheStrategy = 'none'
}) => {
  const fetchSource = modern && cacheStrategy !== 'none'
    ? swrImport
    : legacyImport;

  if (hasComponent(url)) {
    return getComponent(url);
  }

  const source = await fetchSource(url, {
    onError: console.error,
    onDone: () => {
      
    }
  });
};
