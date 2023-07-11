import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import fs from 'fs';
import { getResourcePath } from './util';
import createWindow from './createWindow';
import log from '../lib/util/log';

// eslint-disable-next-line import/no-mutable-exports
export let window: null | BrowserWindow;

export default function appReady() {
  // set up tray
  const iconPath = path.join(
    getResourcePath('assets'),
    'snippet-icon-Template.png'
  );

  if (!fs.existsSync(iconPath)) {
    log('icon doesnt exist');
  }

  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  const tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: async () => {
        if (window) {
          window.show();
        } else {
          window = await createWindow();
          window.on('closed', () => {
            if (process.platform === 'darwin') {
              app.dock.hide();
            }
            window = null;
          });
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}
