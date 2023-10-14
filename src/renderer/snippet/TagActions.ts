function rename($loki: number, title: string) {
  window.electron.ipcRenderer.renameTag({ $loki, title });
}

export default {
  rename,
};
