import remotes from './remotes';

export { registerDependencies, removeModule } from './scopes';
export { remoteImport, promisifiedImport } from './import';
export { clearCache, clearEntries } from './utils/cache';
export { remotes };
