import { IpcMainInvokeEvent } from 'electron';
import dataToRenderer from '../toRenderer/dataToRenderer';
import { promises as fs } from 'fs';
import { SNIPPETS } from '../CONST';
import FuzzySearch from 'fuzzy-search';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';
import path from 'path';
import { SearchResult } from './types';
import log from '../util/log';

export async function handleSearchInput(
  _event: IpcMainInvokeEvent,
  _text: string
) {
  try {
    const dirResults = await fs.readdir(SNIPPETS);
    const snippets = dirResults.filter((file) => !file.startsWith('.'));

    const searcher = new FuzzySearch(snippets);
    const result = searcher.search(_text);

    const bodyResults = await readFilesAsync(
      result.map((f) => path.join(SNIPPETS, f, f))
    );

    const returnableResults: SearchResult[] = result.map((title, i) => {
      return {
        title,
        body: bodyResults[i],
      };
    });

    dataToRenderer('SEARCH:RESULTS', returnableResults);
  } catch (error) {
    log(error);
    sendErrorToRenderer(error);
  }
}

async function readFilesAsync(files: string[]): Promise<string[]> {
  const results: string[] = [];
  for (const file of files) {
    try {
      const data = await fs.readFile(file, 'utf8');
      results.push(data);
    } catch (err) {
      // just log the error for now.
      log(`Error reading file ${file}`);
      log(err);
    }
  }
  return results;
}
