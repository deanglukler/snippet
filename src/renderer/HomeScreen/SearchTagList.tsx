import { Typography } from 'antd';
import { useS } from '../../lib/store';
import SnippetActions from '../../lib/snippet/SnippetActions';

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
        {snippetSearch.tagOptions.map((tag) => {
          const isActiveInSearch = snippetSearch.searchTags.includes(tag);

          return (
            <Typography.Link
              onClick={() => SnippetActions.searchTagClick(tag)}
              key={tag}
              style={Object.assign(
                {
                  color: 'var(--gray)',
                  fontWeight: isActiveInSearch ? 600 : 'unset',
                  padding: '3px 10px',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid transparent',
                  margin: 0,
                },
                isActiveInSearch
                  ? {
                      /* extra styles if active */
                      border: '1px solid var(--light-gray)',
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
