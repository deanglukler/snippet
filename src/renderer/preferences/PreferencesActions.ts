async function updateIconInTray(value: boolean) {
  return await window.electron.ipcRenderer.updatePrefs({
    name: 'iconInTray',
    value,
  });
}

export default {
  updateIconInTray,
};
