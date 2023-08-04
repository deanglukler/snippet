import { Checkbox, Typography } from 'antd';
import { useIPC } from '../hooks/useIPC';
import { useS } from '../store';

export default function () {
  useIPC();
  const prefs = useS((s) => s.preferences);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Typography.Title level={3}>Preferences</Typography.Title>
      <Checkbox checked={prefs.iconInTray.value}>
        Show Icon in Status Bar
      </Checkbox>
    </div>
  );
}
