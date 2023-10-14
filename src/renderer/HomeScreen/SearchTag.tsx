import { Button, Card, Input, Space, Typography } from 'antd';
import { useS } from '../store';
import SnippetActions from '../snippet/SnippetActions';
import { useRef, useState } from 'react';
import Popover from '../components/Popover';
import { EditOutlined } from '@ant-design/icons';
import { TagRenderer } from '../../types';
import TagActions from '../snippet/TagActions';

const SearchTag: React.FC<{ tag: TagRenderer }> = ({ tag }) => {
  const searchParams = useS((s) => s.searchParams);
  const isActiveInSearch = searchParams.searchTags.includes(tag);

  const [renameValue, setRenameValue] = useState(tag.title);
  const [renaming, setRenaming] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const ref = useRef<HTMLAnchorElement | null>(null);

  async function handleRenameTag() {
    setRenameLoading(true);
    await TagActions.rename(tag.$loki, renameValue);
    await SnippetActions.getAllSnippets();
    setRenameLoading(false);
    handleResetRenaming();
  }

  function handleResetRenaming() {
    setRenameValue(tag.title);
    setRenaming(false);
  }

  return (
    <Popover
      anchorRef={ref}
      onBlur={handleResetRenaming}
      content={
        <Card
          size="small"
          style={{
            width: 200,
            boxShadow:
              '0px 1px 4px 0px rgba(0, 0, 0, 0.03), 0px 1px 12px 0px rgba(0, 0, 0, 0.02), 0px 2px 8px 0px rgba(0, 0, 0, 0.02)',
          }}
        >
          <Typography.Paragraph type="secondary">
            Tag: {tag.title}
          </Typography.Paragraph>
          {renaming && (
            <Input
              style={{ marginBottom: 5 }}
              placeholder="Title"
              value={renameValue}
              onChange={({ target }) => setRenameValue(target.value)}
            />
          )}
          <Space direction="horizontal">
            {!renaming && (
              <Button
                type="text"
                ghost
                size="small"
                icon={<EditOutlined />}
                onClick={() => setRenaming(true)}
              >
                Rename
              </Button>
            )}
            {renaming && (
              <Button
                size="small"
                type="text"
                onClick={() => setRenaming(false)}
              >
                Cancel
              </Button>
            )}
            {renaming && (
              <Button
                size="small"
                disabled={renameValue.length === 0 || renameValue === tag.title}
                onClick={handleRenameTag}
                loading={renameLoading}
              >
                Save
              </Button>
            )}
          </Space>
        </Card>
      }
    >
      <Typography.Link
        ref={ref}
        onClick={() => SnippetActions.searchTagClick(tag)}
        type="secondary"
        key={tag.$loki}
        style={Object.assign(
          {
            fontWeight: isActiveInSearch ? 600 : 'unset',
            padding: '3px 10px',
            borderRadius: 'var(--borderRadius)',
            border: '1px solid transparent',
            margin: 0,
          },
          isActiveInSearch
            ? {
                /* extra styles if active */
                border: '1px solid var(--colorBorder)',
                color: 'green',
              }
            : {
                /* no extra styles if inactive */
              }
        )}
      >
        # {tag.title}
      </Typography.Link>
    </Popover>
  );
};

export default SearchTag;
