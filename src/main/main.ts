import { app } from 'electron';
import mainGetTags from './snippet/mainGetTags';

import appReady from './appReady';
import initIpc from './initIpc';
import { isDebug, createDirIfNone } from './util';
import { SNIPPETS_DIR } from '../CONST';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

createDirIfNone(SNIPPETS_DIR);

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(appReady).catch(console.log);

initIpc();
mainGetTags();
