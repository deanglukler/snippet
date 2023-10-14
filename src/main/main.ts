import fs from 'fs';
import { app } from 'electron';

import appReady from './appReady';
import initIpc from './initIpc';
import { isDebug, createDirIfNone } from './util';
import { SNIPPETS_DIR, SNIPPET_APPLICATION_SUPPORT } from '../CONST';
import log from './log';
import seed from './db/seed';

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(appReady).catch(console.log);

//

//

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

if (!fs.existsSync(SNIPPET_APPLICATION_SUPPORT)) {
  log(
    'Creating application support directory.. ' + SNIPPET_APPLICATION_SUPPORT
  );
  fs.mkdirSync(SNIPPET_APPLICATION_SUPPORT);
  log(`Created Dir: ${SNIPPET_APPLICATION_SUPPORT}`);
}

createDirIfNone(SNIPPETS_DIR);

// seed the database which will create the database if it doesn't exist (by sideeffect)
seed();
initIpc();
