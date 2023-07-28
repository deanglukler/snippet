import { promises as fs } from 'fs';
import path from 'path';
import { METADATA_FILENAME, SNIPPETS } from '../CONST';
import log from '../util/log';
import { SnippetDataSerialized } from './types';
import FuzzySearch from 'fuzzy-search';
import logAndThrow from '../util/logAndThrow';
import safelyParseMetadata from './safelyParseSnippetMetadata';

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

  const snippetTitles = await snippetContainers();
  const snippetBodies = await readFilesAsyncHelper(
    snippetTitles.map((f) => path.join(SNIPPETS, f, f))
  );
  const snippetMetadatasUnparsed = await readFilesAsyncHelper(
    snippetTitles.map((f) => path.join(SNIPPETS, f, METADATA_FILENAME))
  );
  const snippetMetadatas = snippetMetadatasUnparsed.map(safelyParseMetadata);

  const snippets: { [key: string]: SnippetDataSerialized } = {};
  for (let i = 0; i < snippetTitles.length; i++) {
    const title = snippetTitles[i];
    const body = snippetBodies[i];
    const metadata = snippetMetadatas[i];
    const searchableKeyName = title + body + metadata.tags.join(' ');
    snippets[searchableKeyName] = {
      title,
      body,
      metadata: JSON.stringify(metadata),
    };
  }

  const searchableKeyNames = Object.keys(snippets);
  const searcher = new FuzzySearch(searchableKeyNames);
  const results = searchText ? searcher.search(searchText) : searchableKeyNames;

  const returnableResults: SnippetDataSerialized[] = results.map((k) => {
    const snippetData = snippets[k];
    if (!snippetData) {
      logAndThrow('Assert: Snippet Data should exist.');
    }
    return snippets[k];
  });
  return returnableResults;
}
