import { Button } from 'antd';
import Search from './Search';
import { PlusOutlined } from '@ant-design/icons';
import { setSnippetBodyFromClipboard } from '../../lib/storeActions';
import SnippetForm from './SnippetForm';
import { useS } from '../../lib/store';

export default function HomescreenLayout() {
  const { body: snippetBody } = useS((s) => s.snippetUpdater);
  return (
    <div
      style={{
        minWidth: '300px',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        padding: '15px',
      }}
    >
      {!snippetBody && (
        <>
          <Button
            style={{ position: 'absolute', top: '15px', right: '15px' }}
            type="dashed"
            icon={<PlusOutlined />}
            onClick={setSnippetBodyFromClipboard}
          >
            New Snippet
          </Button>
          <Search />
        </>
      )}
      {snippetBody && <SnippetForm />}
    </div>
  );
}
