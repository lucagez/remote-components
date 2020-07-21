export as namespace remoteCore;

type UrlString = string;

type Dependencies = {
  [key: string]: any;
}

type CacheStrategy = 'none' | 'stale' | 'revalidate' | 'rerender'

type JsModule = any;

type ImportDoneCb = (_module: JsModule) => void;
type ImportErrorCb = (error: Error) => void;

type BaseImportConfig = {
  url: UrlString;
  dependencies?: Dependencies;
  base?: UrlString;
  relative?: boolean;
}

type ImportConfig = {
  url: UrlString;
  dependencies?: Dependencies;
  base?: UrlString;
  relative?: boolean;
  cacheStrategy?: CacheStrategy;
  onDone?: ImportDoneCb;
  onError?: ImportErrorCb;
}

type RemoteImport = (config: ImportConfig) => void;

export function registerDependencies(dependencies: Dependencies): void;

export function removeModule(_module: UrlString): boolean;

export function remoteImport(config: ImportConfig): void;

export function clearCache(): Promise<boolean>;

export function clearEntries(entries: UrlString[]): Promise<boolean[]>;

export function promisifiedImport(config: BaseImportConfig): Promise<JsModule>;

interface RemotePromises {
  import: (config: BaseImportConfig) => Promise<JsModule>;
}

interface Remotes {
  import: (config: ImportConfig) => void;
  remove: (_module: UrlString) => boolean;

  registerDependencies: (dependencies: Dependencies) => void;
  clearCache: () => Promise<boolean>;
  clearEntries: (entries: UrlString[]) => Promise<boolean[]>;

  promise: RemotePromises;
}

export const remotes: Remotes;
