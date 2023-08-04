import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import log from '../renderer/util/log';
import MenuBuilder from './menu';
import { getResourcePath, isDebug, resolveHtmlPath } from './util';

const createWindow: () => Promise<BrowserWindow> = async () => {
  const installExtensions = async () => {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload
      )
      .catch(log);
  };
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = getResourcePath('assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      if (process.platform === 'darwin') {
        app.dock.show();
      }
      mainWindow.show();
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  return mainWindow;
};

export default createWindow;
