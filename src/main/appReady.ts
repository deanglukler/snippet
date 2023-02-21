import { app, Menu, Tray } from 'electron';
import path from 'path';
import fs from 'fs';
import { getResourcePath } from './util';

export default function appReady() {
  // set up tray
  const iconPath = path.join(
    getResourcePath('assets'),
    'snippet-icon-Template.png'
  );

  if (!fs.existsSync(iconPath)) {
    console.log('icon doesnt exist');
  }

  const tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        console.log('Open clicked');
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
