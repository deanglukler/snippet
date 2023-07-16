import { Button, Card, Divider, Input, List, Space } from 'antd';
import _ from 'lodash';
import { useS } from '../../lib/store';
import { errorAndToast, successToast } from '../../lib/toast';
import NotWide from '../components/NotWide';
import TruncatedComponent from '../components/TruncatedComponent';
import { useTheme } from '../hooks';
import { DeleteOutlined } from '@ant-design/icons';

const debouncedSearch = _.debounce((text: string) =>
  window.electron.ipcRenderer.sendSearch(text)
);

function Search() {
  const { results } = useS((s) => s.snippetSearch);

  const theme = useTheme();

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
            debouncedSearch(e.target.value);
          }}
          placeholder="Search snippets"
        />
      </NotWide>
      <Divider />
      <div>
        <List
          dataSource={results}
          renderItem={({ title, body }) => {
            return (
              <List.Item>
                <Card
                  bordered={false}
                  style={{ width: '100%' }}
                  title={title}
                  extra={
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
                  }
                >
                  <Space direction="vertical">
                    {/* <Typography.Title level={4}>{title}</Typography.Title> */}
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
                </Card>
              </List.Item>
            );
          }}
          locale={{ emptyText: ' ' }}
        />
      </div>
    </>
  );
}

export default Search;
