import { app } from 'electron';
import path from 'path';

export const DOCUMENTS = app.getPath('documents');
export const USER_DATA = app.getPath('userData');
export const SNIPPET_APPLICATION_SUPPORT = path.join(USER_DATA, 'snippet-v0');
export const DATABASE_PATH = path.join(
  SNIPPET_APPLICATION_SUPPORT,
  'snippet-app-database.lokidb'
);

export const SNIPPETS = path.join(DOCUMENTS, 'snippet');

export const METADATA_FILENAME = 'metadata.json';
