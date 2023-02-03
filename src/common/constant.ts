import { resolve as pathResolve } from 'path';

export const FILE_ROOT =
  process.env.FILE_ROOT || pathResolve(__dirname, '../../.tmp/');
