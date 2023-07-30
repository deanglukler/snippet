import { InputRef, Typography } from 'antd';
import SnippetActions from '../../lib/snippet/SnippetActions';
import { useEffect, useRef } from 'react';
import { useS } from '../../lib/store';
import './SnippetList.css';
import SnippetListItem from './SnippetListItem';

export default function () {
  const snippetUpdater = useS((s) => s.snippetUpdater);
  const { results } = useS((s) => s.snippetSearch);
  const newSnippetTitleInputRef = useRef<InputRef>(null);
  const prevNewSnippetTitleInputRef = useRef<any>(null);

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

      {results.map((snippet) => {
        return <SnippetListItem snippet={snippet} />;
      })}
    </div>
  );
}
