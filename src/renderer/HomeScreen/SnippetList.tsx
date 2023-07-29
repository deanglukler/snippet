import { Button, Divider, Input, InputRef, Space, Typography } from 'antd';
import _ from 'lodash';
import { errorAndToast, successToast } from '../../lib/toast';
import NotWide from '../components/NotWide';
import { useTheme } from '../hooks';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import SnippetActions from '../../lib/snippet/SnippetActions';
import { useEffect, useRef } from 'react';
import store, { useA, useS } from '../../lib/store';
import TagSelector from './TagSelector';
import DeleteButton from '../components/DeleteButton';
import './SnippetList.css';
import AnimatedBorderBox from '../components/AnimatedBorderBox';
import SnippetBody from '../components/SnippetBody';

const debouncedSearch = _.debounce((text: string) =>
  window.electron.ipcRenderer.sendSearch(text)
);

export default function () {
  const { results, searchText } = useS((s) => s.snippetSearch);
  const snippetUpdater = useS((s) => s.snippetUpdater);
  const setSnippetSearch = useA((a) => a.snippetSearch.set);
  const theme = useTheme();
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
          <Typography.Link onClick={SnippetActions.initializeNew}>
            Create New Snippet.
          </Typography.Link>
        </Typography.Paragraph>
      )}
      <div>
        <div>
          {snippetUpdater.bodyPreview && (
            <AnimatedBorderBox>
              <div className="list-card">
                <Typography.Title level={3}>
                  Clipboard Preview:
                </Typography.Title>
                <SnippetBody
                  body={snippetUpdater.bodyPreview}
                  theme={theme}
                  truncateHeight={500}
                />
              </div>
            </AnimatedBorderBox>
          )}
          {snippetUpdater.body && (
            <AnimatedBorderBox>
              <div
                style={{
                  paddingBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                }}
              >
                <Space direction="vertical" style={{ width: '300px' }}>
                  <Input
                    ref={newSnippetTitleInputRef}
                    type="text"
                    placeholder="Snippet Title"
                    bordered={false}
                    size="large"
                    style={{ fontWeight: 600, paddingLeft: 0 }}
                    value={snippetUpdater.title}
                    onChange={({ target }) =>
                      store
                        .getActions()
                        .snippetUpdater.set({ title: target.value })
                    }
                  />
                  <TagSelector />
                </Space>
                <Space>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={SnippetActions.clearSnippetUpdaterData}
                  />
                  <Button
                    disabled={!snippetUpdater.isValid}
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={SnippetActions.submit}
                  >
                    Save
                  </Button>
                </Space>
              </div>
              <HorizontalLine />
              <div>
                <SnippetBody
                  body={snippetUpdater.body}
                  theme={theme}
                  truncateHeight={500}
                />
              </div>
            </AnimatedBorderBox>
          )}
          {results.map(({ title, body, metadata }) => {
            return (
              <div className="list-card" key={title}>
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
                        <Typography.Text
                          key={tag}
                          style={{ color: 'var(--gray)' }}
                        >
                          # {tag}
                        </Typography.Text>
                      );
                    })}
                  </div>
                )}
                <HorizontalLine />

                <div>
                  <SnippetBody body={body} theme={theme} />
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
          })}
        </div>
      </div>
    </>
  );
}

function HorizontalLine() {
  return (
    <div
      style={{
        borderBottom: '1px solid var(--light-gray)',
        height: '1px',
      }}
    />
  );
}
