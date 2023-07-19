import { promises as fs } from 'fs';
import path from 'path';
import { METADATA_FILENAME, SNIPPETS } from '../CONST';
import log from '../util/log';
import { SnippetDataSerialized } from './types';
import FuzzySearch from 'fuzzy-search';

export default async function (searchText?: string) {
  async function snippetContainers() {
    const dirResults = await fs.readdir(SNIPPETS);
    return dirResults.filter((file) => !file.startsWith('.'));
  }

  async function readFilesAsyncHelper(files: string[]): Promise<string[]> {
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

  const containers = await snippetContainers();

  const searcher = new FuzzySearch(containers);
  const result = searchText ? searcher.search(searchText) : containers;

  const bodyResults = await readFilesAsyncHelper(
    result.map((f) => path.join(SNIPPETS, f, f))
  );

  const metadataResults = await readFilesAsyncHelper(
    result.map((f) => path.join(SNIPPETS, f, METADATA_FILENAME))
  );

  const returnableResults: SnippetDataSerialized[] = result.map((title, i) => {
    return {
      title,
      body: bodyResults[i],
      metadata: metadataResults[i],
    };
  });
  return returnableResults;
}
