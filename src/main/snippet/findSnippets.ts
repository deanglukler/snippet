import { DBModels, LokiItem, SearchParams, SnippetRenderer } from '../../types';
import _ from 'lodash';
import db from '../db/db';

export async function findSnippetsDry(): Promise<SnippetRenderer[]> {
  const allTags = await db.selectAll('tags');

  const snippetWithTags = (s: LokiItem<DBModels['snippets']>) => {
    const tags = allTags.filter((t) => t.snippetIds.includes(s.$loki));

    return {
      ...s,
      tags,
    };
  };

  const allSnippets = await db.selectAll('snippets');
  const returnable = allSnippets.map(snippetWithTags);
  return returnable;
}

export async function findSnippets(
  search: SearchParams
): Promise<SnippetRenderer[]> {
  const searchTags = search.tags || [];

  const allTags = await db.selectAll('tags');

  const snippetWithTags = (s: LokiItem<DBModels['snippets']>) => {
    const tags = allTags.filter((t) => t.snippetIds.includes(s.$loki));

    return {
      ...s,
      tags,
    };
  };

  if (searchTags.length === 0 && !search.text) {
    const allSnippets = await db.selectAll('snippets');
    const returnable = allSnippets.map(snippetWithTags);
    return returnable;
  }

  //

  //

  if (searchTags.length > 0) {
    const snippetsMatchingTags: LokiItem<DBModels['snippets']>[] = [];

    for (let i = 0; i < searchTags.length; i++) {
      const tag = searchTags[i];
      for (let j = 0; j < tag.snippetIds.length; j++) {
        const snippetId = tag.snippetIds[j];
        const snippet = await db.select('snippets', snippetId);
        if (snippet) {
          snippetsMatchingTags.push(snippet);
        }
      }
    }

    const returnable = _.uniqBy(snippetsMatchingTags, '$loki').map(
      snippetWithTags
    );
    return returnable;
  }

  return [];
}
