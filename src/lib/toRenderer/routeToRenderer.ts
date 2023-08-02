import _ from 'lodash';

import { window } from '../../main/appReady';
import { ROUTES } from '../../types';

export default function (route: ROUTES) {
  if (_.isObject(window)) {
    window.webContents.send('IPC:ROUTE', route);
  }
}
