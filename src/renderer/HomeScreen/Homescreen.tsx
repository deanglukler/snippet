import { useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';
import { Button, Input, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SnippetList from './SnippetList';
import SnippetActions from '../../lib/snippet/SnippetActions';
import { useA, useS } from '../../lib/store';
import NotWide from '../components/NotWide';
import _ from 'lodash';

const debouncedSearch = _.debounce((text: string) =>
  window.electron.ipcRenderer.sendSearch(text)
);
export default function Homescreen() {
  useIPC();
  const setSnippetSearch = useA((a) => a.snippetSearch.set);
  const { searchText } = useS((s) => s.snippetSearch);
  const snippetUpdater = useS((s) => s.snippetUpdater);

  useEffect(() => {
    function setInitialStoreState() {
      window.electron.ipcRenderer.sendSearch('');
    }
    setInitialStoreState();
  }, []);

  useEffect(() => {
    const searchTimer = setInterval(() => {
      debouncedSearch(searchText);
    }, 500);

    return () => {
      clearInterval(searchTimer);
    };
  });

  function newSnippetButtonDisabled() {
    if (snippetUpdater.body) return true;
    return false;
  }

  return (
    <div
      style={{
        minWidth: '515px',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        height: '100vh',
        display: 'grid',
        gridTemplateRows: '[header] min-content [content] auto',
        padding: '0 10px',
      }}
    >
      <div>
        <div
          style={{
            gridRow: 'header / content',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 25,
          }}
        >
          <Input
            onChange={(e) => {
              setSnippetSearch({ searchText: e.target.value });
            }}
            value={searchText}
            placeholder="Search snippets"
            style={{ width: '100%', maxWidth: 300 }}
          />
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={SnippetActions.initializeNew}
            onMouseEnter={SnippetActions.setSnippetBodyPreviewFromClipboard}
            onMouseLeave={SnippetActions.clearSnippetBodyPreview}
            disabled={newSnippetButtonDisabled()}
          >
            {!newSnippetButtonDisabled() && 'New Snippet'}
            {newSnippetButtonDisabled() && 'Creation In Progress'}
          </Button>
        </div>
        <Divider />
      </div>
      <div
        style={{
          gridRow: 'content / content',
          overflowY: 'scroll',
          paddingRight: 5,
          marginRight: -5,
        }}
        className="scrollbar-style"
      >
        <SnippetList />
      </div>
    </div>
  );
}
