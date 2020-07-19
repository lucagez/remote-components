import { registerDependencies, removeModule } from './scopes';
import { remoteImport, promisify } from './import';
import { clearCache, clearEntries } from './utils/cache';

/**
 * Aliases
 */
const remotes = {
  import: remoteImport,
  remove: removeModule,

  /**
   * TODO: add utils to interact with registered modules
   */

  registerDependencies,
  clearCache,
  clearEntries,

  promise: {
    import: promisify(remoteImport),
  },
};

export { remotes };
