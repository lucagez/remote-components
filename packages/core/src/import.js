import { swrFetch, legacyFetch } from './fetch';
import { modern } from './features';
import { hasModule, getModule } from './scopes';
import { contextify } from './contextify';
import { noop } from './utils/noop';

const remoteImport = ({
  url,
  dependencies = {},
  cacheStrategy = 'none',
  base,
  relative,
  onDone = noop,
  onError = noop,
}) => {
  const fetchSource =
    modern && cacheStrategy !== 'none' ? swrFetch : legacyFetch;

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
    
      onDone(getModule(url));
    } catch(error) {
      onError(error);
    }
  };

  if (hasModule(url)) {
    onDone(getModule(url));
  } else {
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
  }
};

const promisify = (_import) => {
  return (options) => new Promise((resolve, reject) => {
    _import({
      ...options,
      cacheStrategy: 'none',
      onDone: resolve,
      onError: reject,
    });
  });
};

export { remoteImport, promisify };
