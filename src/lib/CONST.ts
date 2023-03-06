import { app } from 'electron';
import path from 'path';

export const DOCUMENTS = app.getPath('documents');
export const SNIPPETS = path.join(DOCUMENTS, 'snippets');
