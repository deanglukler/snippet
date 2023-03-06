import { Select, SelectProps } from 'antd';
import { useA } from '../../lib/store';

const options: SelectProps['options'] = [
  { value: 'dev tag', label: 'dev tag' },
];

export default function () {
  const { set } = useA((a) => a.snippetUpdater);

  const handleChange = (values: string[]) => {
    set({ tags: values });
  };

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="Tags"
      onChange={handleChange}
      options={options}
    />
  );
}
