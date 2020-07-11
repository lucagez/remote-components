import { swrImport, legacyImport } from './loader';
import { modern } from './features';
import { hasComponent, getComponent, registerComponent } from './scopes';
import { contextify } from './contextify';

const remoteImport = async ({
  url,
  dependencies = {},
  cacheStrategy = 'none',
}) => {
  const fetchSource =
    modern && cacheStrategy !== 'none' ? swrImport : legacyImport;

  if (hasComponent(url)) {
    return getComponent(url);
  }

  try {
    const source = await fetchSource(url);

    /**
     * Evaluating source in a mocked context.
     * Providing ad-hoc module, exports and require objects.
     * Dependencies inside evaluated module are scoped.
     * This is making possible to host multiple versions
     *  of conflicting dependencies in the same page.
     */
    contextify(url, source, dependencies);


  } catch (error) {}
};
