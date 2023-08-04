import fs from 'fs';
import Loki from 'lokijs';
import log from '../renderer/util/log';
import { DATABASE_PATH, SNIPPET_APPLICATION_SUPPORT } from '../CONST';
import { PreferenceBoolean, PreferenceString } from '../types';

log('DB_PATH: ', DATABASE_PATH);
const COLLECTION = { PREF_BOOL: 'prefBool', PREF_STRING: 'prefString' };

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
      autosave: true,
      autosaveInterval: 10,
    });
    db.addCollection(COLLECTION.PREF_STRING);
    db.addCollection(COLLECTION.PREF_BOOL);

    const prefBool = db.getCollection(COLLECTION.PREF_BOOL);
    const prefString = db.getCollection(COLLECTION.PREF_STRING);

    const prefBoolInserts: PreferenceBoolean[] = [
      { preference: 'iconInTray', value: true, category: 'user' },
      { preference: 'doYouLikeMe', value: true, category: 'user' },
    ];
    const prefStringInserts: PreferenceString[] = [
      { preference: 'snippetsDirectory', value: 'DEFAULT', category: 'user' },
      { preference: 'doYouLikeMe', value: 'yes', category: 'user' },
    ];
    prefBool.insert(prefBoolInserts);
    prefString.insert(prefStringInserts);

    log('Initialized new database!');
    db.loadDatabase({}, () => {
      resolve(db);
    });
  }
});

export default dbPromise;
export { COLLECTION };
