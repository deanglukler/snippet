import _ from 'lodash';
import { ROUTES } from '../../types';
import { BrowserWindow } from 'electron';

export default function (window: BrowserWindow | null, route: ROUTES) {
  if (_.isObject(window)) {
    window.webContents.send('IPC:ROUTE', route);
  }
}
