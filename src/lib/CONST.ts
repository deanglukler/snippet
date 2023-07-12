import { app } from 'electron';
import path from 'path';

export const DOCUMENTS = app.getPath('documents');
export const USER_DATA = app.getPath('userData');
export const SNIPPET_APPLICATION_SUPPORT = path.join(USER_DATA, 'v0');
export const SNIPPETS = path.join(DOCUMENTS, 'snippet');

export const METADATA_FILENAME = 'metadata.json';
