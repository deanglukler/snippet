import { useEffect } from 'react';
import _ from 'lodash';
import { useA } from '../store';
import SnippetActions from '../snippet/SnippetActions';

const useSnippetFetcher = () => {
  const snippetsActions = useA((a) => a.snippets);

  // get initial data
  useEffect(() => {
    SnippetActions.getAllSnippets();
  }, [snippetsActions]);
};

export default useSnippetFetcher;
