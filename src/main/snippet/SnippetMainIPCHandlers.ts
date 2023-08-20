import { clipboard } from 'electron';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';
import { METADATA_FILENAME, SNIPPETS } from '../../CONST';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';
import successToRenderer from '../toRenderer/successToRenderer';
import log from '../../renderer/util/log';
import logAndThrow from '../../renderer/util/logAndThrow';
import {
  IPCMainHandlerFunction,
  SearchParams,
  SnippetData,
  SnippetDataSerialized,
  SnippetMetaData,
  SnippetMetadataUpdate,
  TagList,
} from '../../types';

import dataToRenderer from '../toRenderer/dataToRenderer';
import findSnippets from '../../renderer/snippet/findSnippets';
import mainGetTags from '../../renderer/snippet/mainGetTags';

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
    const snipDir = getSnipDirPath(snippet.title);
    createDirIfNone(snipDir);

    try {
      writeFileSync(path.join(snipDir, snippet.title), snippet.body);
      writeFileSync(
        path.join(snipDir, METADATA_FILENAME),
        JSON.stringify(snippet.metadata)
      );
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

const updateSnippetMetadata: IPCMainHandlerFunction<
  SnippetMetadataUpdate,
  SnippetMetaData | null
> = async (_event, updateData) => {
  try {
    const snipDir = getSnipDirPath(updateData.snippetTitle);
    const metadataPath = path.join(snipDir, METADATA_FILENAME);
    const metadataJSON = readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(metadataJSON);

    const updatedMetadata: SnippetMetaData = {
      ...metadata,
      ...updateData.metadata,
    };
    writeFileSync(
      path.join(snipDir, METADATA_FILENAME),
      JSON.stringify(updatedMetadata)
    );

    return updatedMetadata;
  } catch (error) {
    log(error);
    sendErrorToRenderer(error);
    return null;
  }
};

export default {
  copy: copySnippet,
  save: saveSnippet,
  delete: deleteSnippet,
  search,
  getTags,
  updateSnippetMetadata,
};
