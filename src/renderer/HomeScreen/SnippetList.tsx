import { InputRef, Typography } from 'antd';
import SnippetActions from '../snippet/SnippetActions';
import React, { useEffect, useRef } from 'react';
import { useS } from '../store';
import './SnippetList.css';
import SnippetListItem from './SnippetListItem';
import _ from 'lodash';
import useSnippetLists from '../hooks/useSnippetLists';

export default function () {
  const snippetLists = useSnippetLists();
  const snippetEditor = useS((s) => s.snippetEditor);
  const newSnippetTitleInputRef = useRef<InputRef>(null);
  const prevNewSnippetTitleInputRef = useRef<any>(null);

  const noResults = snippetLists.flatMap((x) => x).length === 0;

  useEffect(() => {
    if (
      newSnippetTitleInputRef.current &&
      !prevNewSnippetTitleInputRef.current
    ) {
      newSnippetTitleInputRef.current.focus({
        cursor: 'all',
      });
    }
    prevNewSnippetTitleInputRef.current = newSnippetTitleInputRef.current;
  });

  return (
    <div>
      {!snippetEditor.body && noResults && (
        <Typography.Paragraph>
          No Snippets Yet.{' '}
          <Typography.Link onClick={SnippetActions.initializeNew}>
            Create New Snippet.
          </Typography.Link>
        </Typography.Paragraph>
      )}

      {snippetLists.map((list) => {
        return list.map((snippet) => {
          return (
            <React.Fragment key={snippet.title}>
              <SnippetListItem snippet={snippet} />
            </React.Fragment>
          );
        });
      })}
    </div>
  );
}
