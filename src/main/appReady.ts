import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import fs from 'fs';
import { getResourcePath } from './util';
import createWindow from './createWindow';
import log from '../lib/util/log';
import routeToRenderer from '../lib/toRenderer/routeToRenderer';

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
      label: 'Open Snippets',
      click: async () => {
        if (window) {
          window.show();
          routeToRenderer('/');
        } else {
          window = await createWindow();
          window.on('closed', () => {
            if (process.platform === 'darwin') {
              app.dock.hide();
            }
            window = null;
          });
          window.on('ready-to-show', () => {
            routeToRenderer('/');
          });
        }
      },
    },
    {
      label: 'Preferences',
      click: async () => {
        if (window) {
          window.show();
          routeToRenderer('/preferences');
        } else {
          window = await createWindow();
          window.on('closed', () => {
            if (process.platform === 'darwin') {
              app.dock.hide();
            }
            window = null;
          });
          window.on('ready-to-show', () => {
            routeToRenderer('/preferences');
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
