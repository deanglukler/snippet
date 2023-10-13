import { Typography } from 'antd';
import { useS } from '../store';
import SearchTag from './SearchTag';
import { Fragment } from 'react';

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
          return (
            <Fragment key={tag}>
              <SearchTag tag={tag} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SearchTagList;
