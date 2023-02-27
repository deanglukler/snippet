import { app, IpcMainInvokeEvent } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';
import successToRenderer from '../toRenderer/successToRenderer';
import log from '../util/log';
import { SnippetData } from './types';

const DOCUMENTS = app.getPath('documents');
const SNIPPETS = path.join(DOCUMENTS, 'snippets');

export function handleSaveSnippet(
  event: IpcMainInvokeEvent,
  snippet: SnippetData
) {
  try {
    createSnippetsDirectory();

    if (existsSync(snipDirPath(snippet.title))) {
      logAndThrow('Snippet with this title already exists');
    }

    writeSnippet(snippet);
    successToRenderer('Saved!');
  } catch (error) {
    sendErrorToRenderer(error);
  }
}

//
//
//

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logAndThrow(message: string, ...arg: any[]) {
  log(message, ...arg);
  throw message;
}

function snipDirPath(title: string) {
  return path.join(SNIPPETS, title);
}

function writeSnippet(snippet: SnippetData) {
  const snipDir = snipDirPath(snippet.title);
  try {
    // create a directory for the snippet
    createDirIfNone(snipDir);

    // write the snippet file
    writeFileSync(path.join(snipDir, snippet.title), snippet.body);

    // write the metadata file
    writeFileSync(
      path.join(snipDir, 'metadata.json'),
      JSON.stringify(snippet.metadata)
    );

    log('File written successfully!');
  } catch (error) {
    logAndThrow('Error writing snippet file.', error);
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
      logAndThrow('Error creating directory.', error);
    }
  }
}
