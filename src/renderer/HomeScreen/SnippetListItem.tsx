import { Button, Divider, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import DeleteButton from '../components/DeleteButton';
import SnippetBody from '../components/SnippetBody';
import { SnippetData } from '../../lib/snippet/types';
import { errorAndToast, successToast } from '../../lib/toast';
import { useTheme } from '../hooks';
import { useRef } from 'react';

const SnippetListItem: React.FC<{ snippet: SnippetData }> = ({ snippet }) => {
  const { title, body, metadata } = snippet;
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  function copySnippet(b: string) {
    window.electron.ipcRenderer
      .copySnippet(b)
      .then(() => {
        successToast('Copied!');
        return null;
      })
      .catch((err) => {
        errorAndToast('That didnt work.', err);
      });
  }

  return (
    <div ref={ref} className="list-card" key={title}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '55px',
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        <div>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copySnippet(body)}
          >
            Copy
          </Button>
        </div>
      </div>
      {metadata.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            paddingBottom: '10px',
          }}
        >
          {metadata.tags.map((tag) => {
            return (
              <Typography.Text key={tag} style={{ color: 'var(--gray)' }}>
                # {tag}
              </Typography.Text>
            );
          })}
        </div>
      )}
      <Divider />
      <div>
        <SnippetBody body={body} theme={theme} refToScrollOnCollapse={ref} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <DeleteButton
          action={() => {
            window.electron.ipcRenderer.deleteSnippet(title);
          }}
        />
      </div>
    </div>
  );
};

export default SnippetListItem;
