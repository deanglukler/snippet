import { IpcMainInvokeEvent } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { SNIPPETS } from '../CONST';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';
import successToRenderer from '../toRenderer/successToRenderer';
import log from '../util/log';
import logAndThrow from '../util/logAndThrow';
import { SnippetData } from './types';

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

function snipDirPath(title: string) {
  return path.join(SNIPPETS, title);
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
