/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';
import { existsSync, mkdirSync } from 'fs';
import logAndThrow from './logAndThrow';
import log from './log';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getResourcePath(...p: string[]) {
  return app.isPackaged
    ? path.join(process.resourcesPath, ...p)
    : path.join(__dirname, '..', '..', ...p);
}

export const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export function createDirIfNone(directory: string) {
  if (!existsSync(directory)) {
    try {
      mkdirSync(directory, { recursive: true });
      log('Created new directory at: ', directory);
    } catch (error) {
      logAndThrow('Error creating directory.', error);
    }
  }
}
