import { app } from 'electron';
import fs from 'fs';
import Loki from 'lokijs';
import path from 'path';
import log from '../lib/util/log';
import { SNIPPET_APPLICATION_SUPPORT } from '../lib/CONST';

const DB_PATH = path.join(
  app.getPath('userData'),
  'Snippet',
  'database.lokidb'
);

log('DB_PATH: ', DB_PATH);
const COLLECTION = { TAGS: 'tags' };

let db: Loki;
if (fs.existsSync(DB_PATH)) {
  db = new Loki(DB_PATH);
  db.loadDatabase({}, () => {
    // ... add collections and data to the database
  });
} else {
  if (!fs.existsSync(SNIPPET_APPLICATION_SUPPORT)) {
    fs.mkdirSync(SNIPPET_APPLICATION_SUPPORT);
    log('Created Application Support/Snippet');
  }
  db = new Loki(DB_PATH, { autosave: true, autosaveInterval: 10 });
  db.addCollection(COLLECTION.TAGS);

  log('Initialized new database!');
}

const dbPromise = Promise.resolve(db);

export default dbPromise;
export { COLLECTION };
