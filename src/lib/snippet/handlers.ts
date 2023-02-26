import { app, IpcMainInvokeEvent } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import log from '../util/log';
import { SnippetData } from './types';

const DOCUMENTS = app.getPath('documents');
const SNIPPETS = path.join(DOCUMENTS, 'snippets');

function snipDirPath(title: string) {
  return path.join(SNIPPETS, title);
}

export function handleSaveSnippet(
  event: IpcMainInvokeEvent,
  snippet: SnippetData
) {
  createSnippetsDirectory();

  if (existsSync(snipDirPath(snippet.title))) {
    throw new Error('Snippet with this title already exists');
  }

  writeSnippet(snippet);
}

function writeSnippet(snippet: SnippetData) {
  const snipDir = snipDirPath(snippet.title);
  try {
    createDirIfNone(snipDir);
    writeFileSync(path.join(snipDir, snippet.title), snippet.body);
    log('File written successfully!');
  } catch (error) {
    log('Error writing file: ', error);
    throw new Error('Error writing snippet file.');
  }
}

function createSnippetsDirectory() {
  createDirIfNone(SNIPPETS);
}

function createDirIfNone(directory: string) {
  if (!existsSync(directory)) {
    try {
      mkdirSync(directory, { recursive: true });
      log('Created new directory at: ', directory);
    } catch (error) {
      log('Error creating dir: ', error);
      throw new Error('Error creating directory');
    }
  }
}
