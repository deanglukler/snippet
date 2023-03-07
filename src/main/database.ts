import { app } from 'electron';
import fs from 'fs';
import Loki from 'lokijs';
import path from 'path';
import log from '../lib/util/log';

const DB_PATH = path.join(app.getPath('desktop'), 'SNIP_TEST.lokidb');
const COL = { TAGS: 'tags' };

let db: Loki;
if (fs.existsSync(DB_PATH)) {
  db = new Loki(DB_PATH);
  db.loadDatabase({}, () => {
    // ... add collections and data to the database
  });
} else {
  db = new Loki(DB_PATH, { autosave: true, autosaveInterval: 10 });
  db.addCollection(COL.TAGS);

  log('Initialized new database!');
}

const dbPromise = Promise.resolve(db);

export default dbPromise;
export { COL };
