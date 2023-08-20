async function updateIconInTray(value: boolean) {
  const res = await window.electron.ipcRenderer.updatePrefs({
    name: 'iconInTray',
    value,
  });
  return res;
}

async function updateShowOnlyLikedSnippets(value: boolean) {
  const res = await window.electron.ipcRenderer.updatePrefs({
    name: 'showOnlyLikedSnippets',
    value,
  });
  return res;
}

export default {
  updateIconInTray,
  updateShowOnlyLikedSnippets,
};
