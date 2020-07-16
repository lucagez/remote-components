import { swrFetch, legacyFetch } from './fetch';
import { modern } from './features';
import { hasComponent, getComponent } from './scopes';
import { contextify } from './contextify';

const remoteImport = ({
  url,
  dependencies = {},
  cacheStrategy = 'none',
  base,
  relative,
  onDone,
  onError,
}) => {
  const fetchSource =
    modern && cacheStrategy !== 'none' ? swrFetch : legacyFetch;

  if (hasComponent(url)) {
    return getComponent(url);
  }

  const execContext = (source) => {
    try {
      /**
       * Evaluating source in a mocked context.
       * Providing ad-hoc module, exports and require objects.
       * Dependencies inside evaluated module are scoped.
       * This is making possible to host multiple versions
       *  of conflicting dependencies in the same page.
       */
      contextify(url, source, dependencies);
    
      onDone(getComponent(url));
    } catch(error) {
      onError(error);
    }
  };

  /**
   * Preferring a cb approach over a Promise based one.
   * A promise can be fulfilled only once and they are not the best
   * choice for recurring events.
   * e.g. In this case the content can be retrieved twice:
   * - first time as stale, from cache
   * - second time, as fresh source
   * 
   * SPEC: https://www.w3.org/2001/tag/doc/promises-guide#recurring-events
   */
  fetchSource({
    url,
    cacheStrategy,
    base,
    relative,
    onError,
    onDone: execContext,
  });
};

export { remoteImport };
