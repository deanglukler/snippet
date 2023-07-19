import { Button, Divider, Form, Input, Space } from 'antd';
import TagSelector from './TagSelector';
import store, { useS } from '../../lib/store';

import SnippetActions from '../../lib/snippet/SnippetActions';

export default function SnippetForm() {
  const { body, title } = useS((s) => s.snippetUpdater);

  return (
    <Form size="middle">
      <Input.Group
        style={{ display: 'flex', flexWrap: 'wrap', columnGap: '10px' }}
      >
        <Form.Item style={{ minWidth: '250px' }}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={({ target }) =>
              store.getActions().snippetUpdater.set({ title: target.value })
            }
          />
        </Form.Item>
        <Form.Item style={{ minWidth: '250px' }}>
          <TagSelector />
        </Form.Item>
      </Input.Group>
      <Space>
        <Button type="primary" onClick={SnippetActions.submit}>
          Save
        </Button>
        <Button
          type="dashed"
          onClick={SnippetActions.setSnippetBodyFromClipboard}
        >
          Re-Paste
        </Button>
        <Button type="text" onClick={SnippetActions.clearSnippetUpdaterData}>
          Cancel
        </Button>
      </Space>
      <Divider />
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: '0.9rem',
          lineHeight: '1.4',
          paddingLeft: '1rem',
        }}
      >
        {body}
      </pre>
    </Form>
  );
}
