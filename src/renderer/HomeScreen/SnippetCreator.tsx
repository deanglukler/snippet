import { Button, Divider, Input, InputRef, Space, Typography } from 'antd';
import _ from 'lodash';
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SnippetActions from '../snippet/SnippetActions';
import { useEffect, useRef } from 'react';
import store, { useS } from '../store';
import TagSelector from './TagSelector';
import './SnippetList.css';
import AnimatedBorderBox from '../components/AnimatedBorderBox';
import SnippetBody from '../components/SnippetBody';

export default function () {
  const snippetEditor = useS((s) => s.snippetEditor);
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
      {snippetEditor.bodyPreview && (
        <div style={{ position: 'sticky' }}>
          <AnimatedBorderBox>
            <div className="list-card">
              <Typography.Title level={3}>Clipboard Preview:</Typography.Title>
              <SnippetBody
                body={snippetEditor.bodyPreview}
                truncateHeight={500}
              />
            </div>
          </AnimatedBorderBox>
        </div>
      )}
      {snippetEditor.body && (
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
                value={snippetEditor.title}
                onChange={({ target }) =>
                  store.getActions().snippetEditor.set({ title: target.value })
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
                disabled={!snippetEditor.isValid}
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={SnippetActions.submit}
              >
                Save
              </Button>
            </Space>
          </div>
          <Divider />
          <div>
            <SnippetBody body={snippetEditor.body} truncateHeight={500} />
          </div>
        </AnimatedBorderBox>
      )}
    </div>
  );
}
