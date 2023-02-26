import { app, IpcMainInvokeEvent } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { SnippetData } from './types';

const DOCUMENTS = app.getPath('documents');

export function handleSaveSnippet(
  event: IpcMainInvokeEvent,
  snippet: SnippetData
) {
  const body = JSON.stringify(snippet.body);
  const dirPath = path.join(DOCUMENTS, 'snippets');
  const p = path.join(dirPath, `${snippet.title}.txt`);
  try {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(p, body);
    console.log('File written successfully!');
  } catch (error) {
    console.error('Error writing file: ', error);
  }
}
