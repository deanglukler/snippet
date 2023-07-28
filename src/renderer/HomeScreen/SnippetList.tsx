import { Button, Divider, Input, Space, Typography } from 'antd';
import _ from 'lodash';
import { useA, useS } from '../../lib/store';
import { errorAndToast, successToast } from '../../lib/toast';
import NotWide from '../components/NotWide';
import TruncatedComponent from '../components/TruncatedComponent';
import { useTheme } from '../hooks';
import { DeleteOutlined } from '@ant-design/icons';
import SnippetActions from '../../lib/snippet/SnippetActions';
import { useEffect } from 'react';

const debouncedSearch = _.debounce((text: string) =>
  window.electron.ipcRenderer.sendSearch(text)
);

export default function () {
  const { results, searchText } = useS((s) => s.snippetSearch);
  const setSnippetSearch = useA((a) => a.snippetSearch.set);
  const theme = useTheme();

  useEffect(() => {
    const searchTimer = setInterval(() => {
      debouncedSearch(searchText);
    }, 500);

    return () => {
      clearInterval(searchTimer);
    };
  });

  function copySnippet(body: string) {
    window.electron.ipcRenderer
      .copySnippet(body)
      .then(() => {
        successToast('Copied!');
        return null;
      })
      .catch((err) => {
        errorAndToast('That didnt work.', err);
      });
  }

  return (
    <>
      <NotWide>
        <Input
          onChange={(e) => {
            setSnippetSearch({ searchText: e.target.value });
          }}
          value={searchText}
          placeholder="Search snippets"
        />
      </NotWide>
      <Divider />
      {results.length === 0 && (
        <Typography.Paragraph>
          No Snippets Yet.{' '}
          <Typography.Link onClick={SnippetActions.setSnippetBodyFromClipboard}>
            Create New Snippet.
          </Typography.Link>
        </Typography.Paragraph>
      )}
      <div>
        <div>
          {results.map(({ title, body, metadata }) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--lighter-gray)',
                  padding: '15px 25px',
                  borderRadius: '17px',
                  marginBottom: '20px',
                }}
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
                    <Space>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          window.electron.ipcRenderer.deleteSnippet(title);
                        }}
                      />
                      <Button onClick={() => copySnippet(body)}>Copy</Button>
                    </Space>
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
                        <Typography.Text style={{ color: 'var(--gray)' }}>
                          # {tag}
                        </Typography.Text>
                      );
                    })}
                  </div>
                )}
                <div
                  style={{
                    borderBottom: '1px solid var(--light-gray)',
                    height: '1px',
                  }}
                />

                <div>
                  <Space direction="vertical">
                    <TruncatedComponent
                      height={150}
                      bgColor={theme.token.colorBgContainer}
                    >
                      <pre
                        style={{
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.9rem',
                          lineHeight: '1.4',
                        }}
                      >
                        {body}
                      </pre>
                    </TruncatedComponent>
                  </Space>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
