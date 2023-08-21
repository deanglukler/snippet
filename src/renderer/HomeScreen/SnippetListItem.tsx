import { Button, Divider, Typography } from 'antd';
import { CopyOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import DeleteButton from '../components/DeleteButton';
import SnippetBody from '../components/SnippetBody';
import { errorAndToast, successToast } from '../toast';
import { useTheme } from '../hooks';
import { useRef } from 'react';
import { SnippetData } from '../../types';
import SnippetActions from '../snippet/SnippetActions';

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
    <div
      ref={ref}
      className="list-card"
      style={{ backgroundColor: theme.token.colorBgContainer }}
      key={title}
    >
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
          {!metadata.liked && (
            <Button
              onClick={() => {
                SnippetActions.updateSnippetMetadata(title, { liked: true });
              }}
              type="ghost"
              icon={<HeartOutlined />}
            />
          )}
          {metadata.liked && (
            <Button
              onClick={() => {
                SnippetActions.updateSnippetMetadata(title, { liked: false });
              }}
              type="ghost"
              icon={<HeartFilled />}
            />
          )}
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
            flexWrap: 'wrap',
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
      <Divider style={{ margin: '10px 0' }} />
      <div>
        <SnippetBody body={body} refToScrollOnCollapse={ref} />
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
