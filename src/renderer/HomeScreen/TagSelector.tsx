import { Select, SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { useA, useS } from '../store';

export default function TagSelector() {
  const [tagOptions, setTagOptions] = useState<SelectProps['options']>([]);
  const { set } = useA((a) => a.snippetEditor);
  const searchParams = useS((s) => s.searchParams);

  const handleChange = (values: string[]) => {
    set({ tags: values });
  };

  useEffect(() => {
    const tagOpts = searchParams.tagOptions.map((tag) => {
      return { value: tag.title, label: tag.title };
    });
    setTagOptions(tagOpts);
  }, [searchParams.tagOptions]);

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
