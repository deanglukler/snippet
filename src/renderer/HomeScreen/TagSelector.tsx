import { Select, SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { useA } from '../../lib/store';

export default function TagSelector() {
  const [tagOptions, setTagOptions] = useState<SelectProps['options']>([]);
  const { set } = useA((a) => a.snippetUpdater);

  const handleChange = (values: string[]) => {
    set({ tags: values });
  };

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    window.electron.ipcRenderer.getTags().then((tags) => {
      const tagOpts = tags.map((name) => {
        return { value: name, label: name };
      });
      setTagOptions(tagOpts);
      return null;
    });
  }, []);

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
