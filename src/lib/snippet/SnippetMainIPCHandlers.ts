import { clipboard } from 'electron';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';
import { METADATA_FILENAME, SNIPPETS } from '../CONST';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';
import successToRenderer from '../toRenderer/successToRenderer';
import log from '../util/log';
import logAndThrow from '../util/logAndThrow';
import {
  SearchParams,
  SnippetData,
  SnippetDataSerialized,
  TagList,
} from './types';
import { IPCMainHandlerFunction } from '../../types';

import dataToRenderer from '../toRenderer/dataToRenderer';
import findSnippets from './findSnippets';
import mainGetTags from './mainGetTags';

function getSnipDirPath(title: string) {
  return path.join(SNIPPETS, title);
}

const saveSnippet: IPCMainHandlerFunction = async (
  _event,
  snippet: SnippetData
) => {
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
  function writeSnippet() {
    // create a directory for the snippet
    const snipDir = getSnipDirPath(snippet.title);
    createDirIfNone(snipDir);

    try {
      // write the snippet file
      writeFileSync(path.join(snipDir, snippet.title), snippet.body);

      // write the metadata file
      writeFileSync(
        path.join(snipDir, METADATA_FILENAME),
        JSON.stringify(snippet.metadata)
      );

      log('File written successfully!');
    } catch (error) {
      logAndThrow('Error writing snippet file.', error);
    }
  }

  try {
    createDirIfNone(SNIPPETS);

    if (existsSync(getSnipDirPath(snippet.title))) {
      logAndThrow('Snippet with this title already exists');
    }

    writeSnippet();
    successToRenderer('Saved!');
    return;
  } catch (error) {
    sendErrorToRenderer(error);
    throw error;
  }
};

const copySnippet: IPCMainHandlerFunction<string, void> = async (
  _event,
  body: string
) => {
  return clipboard.writeText(body);
};

const deleteSnippet: IPCMainHandlerFunction<string> = async (_event, title) => {
  const snippetDirPath = getSnipDirPath(title);

  if (!existsSync(snippetDirPath)) {
    logAndThrow("Can't find snippet to delete");
  }

  await rm(snippetDirPath, { recursive: true });
};

const search: IPCMainHandlerFunction<SearchParams | undefined> = async (
  _event,
  searchParams
) => {
  try {
    const returnableResults: SnippetDataSerialized[] = await findSnippets(
      searchParams
    );

    dataToRenderer('SEARCH:RESULTS', returnableResults);
  } catch (error) {
    log(error);
    sendErrorToRenderer(error);
  }
};

const getTags: IPCMainHandlerFunction<null, TagList> = async (_event) => {
  try {
    const tags = await mainGetTags();
    return tags;
  } catch (error) {
    sendErrorToRenderer(error);
    return [];
  }
};

export default {
  copy: copySnippet,
  save: saveSnippet,
  delete: deleteSnippet,
  search,
  getTags,
};
