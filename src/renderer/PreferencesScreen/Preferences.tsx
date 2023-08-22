import { Button, Checkbox, Radio, RadioChangeEvent, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useIPC } from '../hooks/useIPC';
import { useA, useS } from '../store';
import PreferencesActions from '../preferences/PreferencesActions';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useNavigate } from 'react-router-dom';

const prefHeaderStyle = {
  margin: '10px 0 8px 0',
};

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
        <Typography.Title style={prefHeaderStyle} level={3}>
          Preferences
        </Typography.Title>
        <Typography.Text type="secondary">ICON</Typography.Text>
        <Checkbox
          onClick={async (e) => {
            // @ts-ignorets-ignore
            const event = e as CheckboxChangeEvent;
            const checked = event.target.checked;
            const p = await PreferencesActions.updateIconInTray(
              Boolean(checked)
            );
            prefsActions.set({
              iconInTray: p.iconInTray,
            });
          }}
          checked={prefs.iconInTray}
        >
          Show Icon in Status Bar
        </Checkbox>
        <Typography.Text style={prefHeaderStyle} type="secondary">
          COLOR THEME
        </Typography.Text>
        <Radio.Group
          onChange={async (e: RadioChangeEvent) => {
            const p = await PreferencesActions.updateColorScheme(
              e.target.value
            );
            prefsActions.set({
              colorScheme: p.colorScheme,
            });
          }}
          value={prefs.colorScheme}
        >
          <Radio value="light">Light</Radio>
          <Radio value="dark">Dark</Radio>
          <Radio value="system">System</Radio>
        </Radio.Group>
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
