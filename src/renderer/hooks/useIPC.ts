import { useEffect } from 'react';
import { useA } from '../../lib/store';
import { SearchResult } from '../../lib/snippet/types';

export function useIPC() {
  const snippetSearchActions = useA((a) => a.snippetSearch);
  useEffect(() => {
    const off = window.electron.ipcRenderer.on('SEARCH:RESULTS', (args) => {
      snippetSearchActions.set({ results: args as SearchResult[] });
    });

    return off;
  }, [snippetSearchActions]);
}
