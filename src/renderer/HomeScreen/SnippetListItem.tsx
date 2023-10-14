import { Button, Divider, Typography } from 'antd';
import { CopyOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import DeleteButton from '../components/DeleteButton';
import SnippetBody from '../components/SnippetBody';
import { errorAndToast, successToast } from '../toast';
import { useRef } from 'react';
import { SnippetRenderer } from '../../types';
import SnippetActions from '../snippet/SnippetActions';
import { useS } from '../store';
import splitStringInclusive from '../util/splitStringInclusive';

function highlightText(text: string, highlight: string) {
  if (highlight) {
    const texts = splitStringInclusive(text, highlight);

    const nextInnerJsx = texts.reduce((jsx, str) => {
      if (str === highlight) {
        return (
          <>
            {jsx}
            <span style={{ backgroundColor: 'yellow' }}>{str}</span>
          </>
        );
      } else {
        return (
          <>
            {jsx}
            {str}
          </>
        );
      }
    }, <></>);
    return nextInnerJsx;
  } else {
    return text;
  }
}

const SnippetListItem: React.FC<{ snippet: SnippetRenderer }> = ({
  snippet,
}) => {
  const { title, body, liked, tags, $loki } = snippet;
  const searchParams = useS((s) => s.searchParams);
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLElement>(null);

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
        <Typography.Title ref={titleRef} level={4} style={{ margin: 0 }}>
          {highlightText(title, searchParams.searchText.trim())}
        </Typography.Title>
        <div>
          <div style={{ display: 'inline', position: 'relative' }}>
            <Button
              onClick={() => {
                SnippetActions.updateSnippetLiked($loki, true);
              }}
              type="ghost"
              icon={<HeartOutlined />}
            />
            {liked && (
              <Button
                onClick={() => {
                  SnippetActions.updateSnippetLiked($loki, false);
                }}
                type="ghost"
                icon={<HeartFilled />}
                style={{
                  position: 'absolute',
                  left: 0,
                }}
              />
            )}
          </div>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copySnippet(body)}
          >
            Copy
          </Button>
        </div>
      </div>
      {tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            paddingBottom: '10px',
          }}
        >
          {tags.map((tag) => {
            return (
              <Typography.Text key={tag.title} type="secondary">
                # {tag.title}
              </Typography.Text>
            );
          })}
        </div>
      )}
      <Divider style={{ margin: '10px 0' }} />
      <div>
        <SnippetBody
          body={highlightText(body, searchParams.searchText.trim())}
          refToScrollOnCollapse={ref}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <DeleteButton
          action={() => {
            SnippetActions.deleteSnippet($loki);
          }}
        />
      </div>
    </div>
  );
};

export default SnippetListItem;
