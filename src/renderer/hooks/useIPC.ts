import { useEffect } from 'react';
import { useA, useS } from '../store';
import { SnippetData, SnippetDataSerialized } from '../../types';
import _ from 'lodash';
import safelyParseMetadata from '../snippet/safelyParseSnippetMetadata';
import { useNavigate } from 'react-router-dom';
import log from '../../main/log';
import initPreferences from '../../initPreferences';

export function useIPC() {
  const snippetSearchActions = useA((a) => a.snippetSearch);
  const snippetSearchResults = useS((s) => s.snippetSearch.results);
  const prefsActions = useA((a) => a.preferences);

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

  const navigate = useNavigate();

  useEffect(() => {
    const off = window.electron.ipcRenderer.on('IPC:ROUTE', (msg) => {
      navigate(msg);
    });

    return off;
  }, [navigate]);

  useEffect(() => {
    window.electron.ipcRenderer
      .getPrefs()
      .then((prefs) => {
        const nextPrefs = {};
        for (const k in initPreferences) {
          // @ts-ignore
          nextPrefs[k] = prefs[k];
        }
        prefsActions.set(nextPrefs);
        return null;
      })
      .catch(log);
  }, [prefsActions]);
}
