import { Typography } from 'antd';
import { useS } from '../store';
import SearchTag from './SearchTag';
import { Fragment } from 'react';

const SearchTagList: React.FC = () => {
  const searchParams = useS((s) => s.searchParams);

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
        {searchParams.tagOptions.length === 0 && (
          <Typography.Text style={{ marginLeft: 10 }} type="secondary">
            No Tags
          </Typography.Text>
        )}
        {searchParams.tagOptions.map((tag) => {
          return (
            <Fragment key={tag.title}>
              <SearchTag tag={tag} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SearchTagList;
