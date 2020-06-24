import { swrImport } from './swr';
import { legacyImport } from './legacy';

/**
 * TODO: switch based on config
 */
export const remoteImport = window.Cache
  ? swrImport
  : legacyImport;
