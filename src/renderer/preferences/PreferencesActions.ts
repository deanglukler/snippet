async function updateIconInTray(value: boolean) {
  const res = await window.electron.ipcRenderer.updatePrefs({
    name: 'iconInTray',
    value,
  });
  return res;
}

export default {
  updateIconInTray,
};
