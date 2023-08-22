import { Typography } from 'antd';
import { useS } from '../store';
import SnippetActions from '../snippet/SnippetActions';

const SearchTagList: React.FC = () => {
  const snippetSearch = useS((s) => s.snippetSearch);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '10px 0',
          alignItems: 'baseline',
        }}
      >
        {snippetSearch.tagOptions.length === 0 && (
          <Typography.Text style={{ marginLeft: 10 }} type="secondary">
            No Tags
          </Typography.Text>
        )}
        {snippetSearch.tagOptions.map((tag) => {
          const isActiveInSearch = snippetSearch.searchTags.includes(tag);

          return (
            <Typography.Link
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
          );
        })}
      </div>
    </div>
  );
};

export default SearchTagList;
