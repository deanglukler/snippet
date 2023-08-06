import fs from 'fs';
import Loki from 'lokijs';
import log from '../renderer/util/log';
import { DATABASE_PATH, SNIPPET_APPLICATION_SUPPORT } from '../CONST';
import { Preferences } from '../types';
import initPreferences from '../initPreferences';

log('DB_PATH: ', DATABASE_PATH);
const COLLECTION = { PREFERENCES: 'preferences' };

const dbPromise = new Promise<Loki>((resolve) => {
  if (fs.existsSync(DATABASE_PATH)) {
    const db = new Loki(DATABASE_PATH, {
      autosave: true,
      autosaveInterval: 10,
    });
    db.loadDatabase({}, () => {
      resolve(db);
    });
    log('Loaded Existing Database at.. ' + DATABASE_PATH);
  } else {
    log('Creating new database...');
    if (!fs.existsSync(SNIPPET_APPLICATION_SUPPORT)) {
      log(
        'Creating application support directory.. ' +
          SNIPPET_APPLICATION_SUPPORT
      );
      fs.mkdirSync(SNIPPET_APPLICATION_SUPPORT);
      log(`Created Dir: ${SNIPPET_APPLICATION_SUPPORT}`);
    }
    const db = new Loki(DATABASE_PATH, {
      autosave: true, // does it work?
      autosaveInterval: 100, // does it work ? ie. I had to use savedatabase() below
    });
    db.addCollection(COLLECTION.PREFERENCES);

    const prefs = db.getCollection(COLLECTION.PREFERENCES);

    const prefsEntry: Preferences = {
      iconInTray: initPreferences.iconInTray,
      snippetsDirectory: initPreferences.snippetsDirectory,
    };
    prefs.insert(prefsEntry);

    db.saveDatabase();

    log('Initialized new database!');
    db.loadDatabase({}, () => {
      resolve(db);
    });
  }
});

export default dbPromise;
export { COLLECTION };
