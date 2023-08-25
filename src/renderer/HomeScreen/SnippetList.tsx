import { InputRef, Typography } from 'antd';
import SnippetActions from '../snippet/SnippetActions';
import React, { useEffect, useMemo, useRef } from 'react';
import { useS } from '../store';
import './SnippetList.css';
import SnippetListItem from './SnippetListItem';
import _ from 'lodash';

export default function () {
  const snippetUpdater = useS((s) => s.snippetUpdater);
  const { results } = useS((s) => s.snippetSearch);
  const newSnippetTitleInputRef = useRef<InputRef>(null);
  const prevNewSnippetTitleInputRef = useRef<any>(null);

  const sortedResults = useMemo(() => {
    const sorted = _.sortBy(results, (r) => {
      return r.metadata.timestampMili;
    });
    return _.reverse(sorted);
  }, [results]);

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
      {!snippetUpdater.body && results.length === 0 && (
        <Typography.Paragraph>
          No Snippets Yet.{' '}
          <Typography.Link onClick={SnippetActions.initializeNew}>
            Create New Snippet.
          </Typography.Link>
        </Typography.Paragraph>
      )}

      {sortedResults.map((snippet) => {
        return (
          <React.Fragment key={snippet.title}>
            <SnippetListItem snippet={snippet} />
          </React.Fragment>
        );
      })}
    </div>
  );
}
