import { Button, Card, Input, Space, Typography } from 'antd';
import { useS } from '../store';
import SnippetActions from '../snippet/SnippetActions';
import { useRef, useState } from 'react';
import Popover from '../components/Popover';
import { useTheme } from '../hooks';
import { EditOutlined } from '@ant-design/icons';

const SearchTag: React.FC<{ tag: string }> = ({ tag }) => {
  const snippetSearch = useS((s) => s.snippetSearch);
  const isActiveInSearch = snippetSearch.searchTags.includes(tag);
  const theme = useTheme();

  const [renameValue, setRenameValue] = useState(tag);
  const [renaming, setRenaming] = useState(false);

  const ref = useRef<HTMLAnchorElement | null>(null);

  return (
    <Popover
      anchorRef={ref}
      onBlur={() => {
        setRenameValue(tag);
        setRenaming(false);
      }}
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
            Tag: {tag}
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
                disabled={renameValue.length === 0 || renameValue === tag}
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
        key={tag}
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
        # {tag}
      </Typography.Link>
    </Popover>
  );
};

export default SearchTag;
