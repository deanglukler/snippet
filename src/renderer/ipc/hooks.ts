import { useEffect } from 'react';
import { SearchResult } from '../../lib/search/types';
import { useA } from '../../lib/store';

export function useIPC() {
  const snippetSearchActions = useA((a) => a.snippetSearch);
  useEffect(() => {
    const off = window.electron.ipcRenderer.on('SEARCH:RESULTS', (args) => {
      snippetSearchActions.set({ results: args as SearchResult[] });
    });

    return off;
  }, [snippetSearchActions]);
}
