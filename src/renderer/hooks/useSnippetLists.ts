import _ from 'lodash';
import { SnippetRenderer } from '../../types';
import { useS } from '../store';
import { useEffect, useState } from 'react';

type SnippetLists = SnippetRenderer[][];

export default function useSnippetList() {
  const snippets = useS((s) => s.snippets.all);
  const searchParams = useS((s) => s.searchParams);
  const preferences = useS((s) => s.preferences);

  const [snippetLists, setSnippetLists] = useState<SnippetLists>([
    [
      /* matches title */
    ],
    [
      /* matches body */
    ],
  ]);

  useEffect(() => {
    const nextSnippetList: SnippetLists = [[], []];
    const unsorted = _.values(snippets);

    const searchTags = searchParams.searchTags;
    const searchText = searchParams.searchText.trim();

    const drySearchText = searchText === '';
    const drySearchTags = searchTags.length === 0;

    const allDry =
      drySearchTags && drySearchText && !preferences.showOnlyLikedSnippets;

    if (allDry) {
      nextSnippetList.push(unsorted);
      setSnippetLists(nextSnippetList);

      return;
    }

    for (const s of unsorted) {
      if (preferences.showOnlyLikedSnippets && !s.liked) continue;

      const tagsMatch =
        _.intersection(
          searchTags.map((x) => x.$loki),
          s.tags.map((x) => x.$loki)
        ).length > 0;

      if (!drySearchTags && !tagsMatch) continue;

      if (drySearchText) {
        nextSnippetList[0].push(s);
        continue;
      }

      if (s.title.includes(searchText)) {
        nextSnippetList[0].push(s);
        continue;
      }

      if (s.body.includes(searchText)) {
        nextSnippetList[1].push(s);
      }
    }

    setSnippetLists(nextSnippetList);
  }, [snippets, searchParams, preferences]);

  return snippetLists;
}
