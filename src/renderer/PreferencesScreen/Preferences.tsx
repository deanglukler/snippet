import { Button, Checkbox, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useIPC } from '../hooks/useIPC';
import { useA, useS } from '../store';
import PreferencesActions from '../preferences/PreferencesActions';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useNavigate } from 'react-router-dom';

export default function () {
  useIPC();
  const prefs = useS((s) => s.preferences);
  const prefsActions = useA((a) => a.preferences);
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Typography.Title level={3}>Preferences</Typography.Title>
        <Checkbox
          onClick={async (e) => {
            // @ts-ignorets-ignore
            const event = e as CheckboxChangeEvent;
            const checked = event.target.checked;
            const p = await PreferencesActions.updateIconInTray(
              Boolean(checked)
            );
            prefsActions.set({
              iconInTray: { ...prefs.iconInTray, value: p.iconInTray.value },
            });
          }}
          checked={prefs.iconInTray.value}
        >
          Show Icon in Status Bar
        </Checkbox>
        <Button
          style={{ marginTop: 30, padding: 0 }}
          onClick={() => {
            navigate('/');
          }}
          type="ghost"
          icon={<ArrowLeftOutlined />}
        >
          Snippets
        </Button>
      </div>
    </div>
  );
}
