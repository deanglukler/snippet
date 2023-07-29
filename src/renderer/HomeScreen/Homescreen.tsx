import { useEffect } from 'react';
import { useIPC } from '../hooks/useIPC';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SnippetList from './SnippetList';
import SnippetActions from '../../lib/snippet/SnippetActions';
import { useS } from '../../lib/store';

export default function Homescreen() {
  useIPC();
  const snippetUpdater = useS((s) => s.snippetUpdater);

  useEffect(() => {
    function setInitialStoreState() {
      window.electron.ipcRenderer.sendSearch('');
    }
    setInitialStoreState();
  }, []);

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
        padding: '15px',
      }}
    >
      <Button
        style={{ position: 'absolute', top: '15px', right: '15px' }}
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
      <SnippetList />
    </div>
  );
}
