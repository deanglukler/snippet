import { promises as fs } from 'fs';
import path from 'path';
import { METADATA_FILENAME, SNIPPETS } from '../../CONST';
import log from '../log';
import { SearchParams, SnippetDataSerialized } from '../../types';
import FuzzySearch from 'fuzzy-search';
import logAndThrow from '../logAndThrow';
import safelyParseMetadata from '../../renderer/snippet/safelyParseSnippetMetadata';
import _ from 'lodash';
import getPreferences from '../preferences/getPreferences';

export default async function (
  search?: SearchParams
): Promise<SnippetDataSerialized[]> {
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
  const prefs = await getPreferences();
  const snippetMetadatas = snippetMetadatasUnparsed.map(safelyParseMetadata);

  const snippets: { [key: string]: SnippetDataSerialized } = {};
  for (let i = 0; i < snippetTitles.length; i++) {
    const title = snippetTitles[i];
    const body = snippetBodies[i];
    const metadata = snippetMetadatas[i];

    if (prefs.showOnlyLikedSnippets.value && !metadata.liked) {
      continue;
    }

    const searchableKeyName = title + body + metadata.tags.join(' ');
    snippets[searchableKeyName] = {
      title,
      body,
      metadata: JSON.stringify(metadata),
    };
  }

  if (!search) {
    return _.values(snippets);
  }

  if (search.tags && search.tags.length > 0) {
    for (const snippetTitle in snippets) {
      const snippet = snippets[snippetTitle];
      const metadata = safelyParseMetadata(snippet.metadata);
      if (!metadata.tags.some((tag) => search.tags?.includes(tag))) {
        delete snippets[snippetTitle];
      }
    }
  }

  if (!search.text) {
    return _.values(snippets);
  }

  const searchableKeyNames = Object.keys(snippets);
  const searcher = new FuzzySearch(searchableKeyNames);
  const results = searcher.search(search.text);

  return results.map((k) => {
    const snippetData = snippets[k];
    if (!snippetData) {
      logAndThrow('Assert: Snippet Data should exist.');
    }
    return snippets[k];
  });
}
