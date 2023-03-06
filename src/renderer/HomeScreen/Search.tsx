import { Input, List, Typography } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { SearchResult } from '../../lib/search/types';
import { useA, useS } from '../../lib/store';

const debouncedSearch = _.debounce((text: string) =>
  window.electron.ipcRenderer.sendSearch(text)
);

function Search() {
  const snippetSearchActions = useA((a) => a.snippetSearch);
  const { results } = useS((s) => s.snippetSearch);

  useEffect(() => {
    const off = window.electron.ipcRenderer.on('SEARCH:RESULTS', (args) => {
      snippetSearchActions.set({ results: args as SearchResult[] });
    });

    return off;
  }, [snippetSearchActions]);

  return (
    <>
      <Input
        onChange={(e) => {
          debouncedSearch(e.target.value);
        }}
      />
      <List
        dataSource={results}
        renderItem={({ title, body }) => {
          return (
            <List.Item>
              <Typography.Title level={4}>{title}</Typography.Title>
              {/* <Typography.Paragraph>{body}</Typography.Paragraph> */}
            </List.Item>
          );
        }}
      />
    </>
  );
}

export default Search;
