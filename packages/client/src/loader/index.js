import { workerImport } from './worker';
import { legacyImport } from './legacy';

export const remoteImport = window.Worker
  ? workerImport
  : legacyImport;
