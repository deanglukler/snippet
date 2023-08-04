import { Select, SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { useA, useS } from '../store';

export default function TagSelector() {
  const [tagOptions, setTagOptions] = useState<SelectProps['options']>([]);
  const { set } = useA((a) => a.snippetUpdater);
  const snippetSearch = useS((s) => s.snippetSearch);

  const handleChange = (values: string[]) => {
    set({ tags: values });
  };

  useEffect(() => {
    const tagOpts = snippetSearch.tagOptions.map((name) => {
      return { value: name, label: name };
    });
    setTagOptions(tagOpts);
  }, [snippetSearch.tagOptions]);

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="Tags"
      onChange={handleChange}
      options={tagOptions}
    />
  );
}
