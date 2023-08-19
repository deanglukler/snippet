import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import fs from 'fs';
import { getResourcePath } from './util';
import createWindow from './createWindow';
import log from '../renderer/util/log';
import routeToRenderer from './toRenderer/routeToRenderer';
import getPreferences from './preferences/getPreferences';

// eslint-disable-next-line import/no-mutable-exports
export let window: null | BrowserWindow = null;
export let tray: null | Tray = null;

const openSnippets = async () => {
  if (window) {
    window.show();
    routeToRenderer(window, '/');
  } else {
    window = await createWindow();
    window.on('closed', () => {
      if (process.platform === 'darwin') {
        app.dock.hide();
      }
      window = null;
    });
    window.on('ready-to-show', () => {
      routeToRenderer(window, '/');
    });
  }
};

function buildTray() {
  const iconPath = path.join(
    getResourcePath('assets'),
    'snippet-icon-Template.png'
  );

  if (!fs.existsSync(iconPath)) {
    log('icon doesnt exist');
  }

  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Snippets',
      click: openSnippets,
    },
    {
      label: 'Preferences',
      click: async () => {
        if (window) {
          window.show();
          routeToRenderer(window, '/preferences');
        } else {
          window = await createWindow();
          window.on('closed', () => {
            if (process.platform === 'darwin') {
              app.dock.hide();
            }
            window = null;
          });
          window.on('ready-to-show', () => {
            routeToRenderer(window, '/preferences');
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

  // tray.setContextMenu(contextMenu);
}

async function manageTray() {
  const prefs = await getPreferences();
  const iconInTray = prefs.iconInTray.value;
  if (window && !tray && iconInTray) {
    buildTray();
    if (tray) {
      (tray as Tray).addListener('click', openSnippets);
    } else {
      throw new Error('tray does not exist and it should');
    }
  } else if (window && tray && !iconInTray) {
    tray.destroy();
    tray = null;
  }
}

export default async function appReady() {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  setInterval(manageTray, 700);

  openSnippets();
}
