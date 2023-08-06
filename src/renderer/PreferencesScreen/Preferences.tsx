import { Checkbox, Typography } from 'antd';
import { useIPC } from '../hooks/useIPC';
import { useA, useS } from '../store';
import PreferencesActions from '../preferences/PreferencesActions';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export default function () {
  useIPC();
  const prefs = useS((s) => s.preferences);
  const prefsActions = useA((a) => a.preferences);

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
      <Checkbox
        onClick={async (e) => {
          // @ts-ignorets-ignore
          const event = e as CheckboxChangeEvent;
          const checked = event.target.checked;
          const p = await PreferencesActions.updateIconInTray(Boolean(checked));
          prefsActions.set({
            iconInTray: { ...prefs.iconInTray, value: p.iconInTray.value },
          });
        }}
        checked={prefs.iconInTray.value}
      >
        Show Icon in Status Bar
      </Checkbox>
    </div>
  );
}
