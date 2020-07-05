import { swrImport } from './swr';
import { legacyImport } from './legacy';
import { modern } from '../features';

/**
 * TODO: switch based on config
 */
export const remoteImport = modern
  ? swrImport
  : legacyImport;

export { swrImport, legacyImport };
