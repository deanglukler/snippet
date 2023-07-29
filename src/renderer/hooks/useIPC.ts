import { useEffect } from 'react';
import { useA, useS } from '../../lib/store';
import { SnippetData, SnippetDataSerialized } from '../../lib/snippet/types';
import _ from 'lodash';
import safelyParseMetadata from '../../lib/snippet/safelyParseSnippetMetadata';

export function useIPC() {
  const snippetSearchActions = useA((a) => a.snippetSearch);
  const snippetSearchResults = useS((s) => s.snippetSearch.results);
  useEffect(() => {
    const off = window.electron.ipcRenderer.on('SEARCH:RESULTS', (args) => {
      const nextResults = args as SnippetDataSerialized[];
      let resultsAreTheSame = true;
      if (snippetSearchResults.length !== nextResults.length)
        resultsAreTheSame = false;

      if (resultsAreTheSame) {
        const currentNamesList = snippetSearchResults.map((x) => x.title);
        const nextNamesList = nextResults.map((x) => x.title);

        if (!_.isEqual(currentNamesList, nextNamesList))
          resultsAreTheSame = false;
      }

      const nextResultsParsed: SnippetData[] = nextResults.map((res) => {
        return { ...res, metadata: safelyParseMetadata(res.metadata) };
      });

      if (!resultsAreTheSame) {
        snippetSearchActions.set({ results: nextResultsParsed });
      }
    });

    return off;
  }, [snippetSearchActions, snippetSearchResults]);
}