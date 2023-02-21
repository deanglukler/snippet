import { ipcMain } from 'electron';
import fs from 'fs';
import Loki from 'lokijs';
import { getResourcePath } from './util';

const DB_PATH = getResourcePath('example.db');

function init(db: Loki) {
  const inputValueCollection = db.getCollection('inputValue');

  ipcMain.on('get-input-value', (event) => {
    const value = inputValueCollection?.find()[0];
    event.reply('get-input-value', value.value);
  });

  ipcMain.on('set-input-value', (event, val) => {
    const value = inputValueCollection.find()[0];
    value.value = val;
    inputValueCollection.update(value);

    return null;
  });
}

// Check if the database file exists on disk
if (!fs.existsSync(DB_PATH)) {
  // Create a new database instance
  const db = new Loki(DB_PATH, { autosave: true, autosaveInterval: 10 });

  const inputValue = db.addCollection<{ value: string }>('inputValue');

  inputValue.insert({ value: 'initial value' });

  init(db);

  console.log('Initialized new database!');
} else {
  // Load the existing database from disk

  const db = new Loki(DB_PATH);
  db.loadDatabase({}, () => {
    init(db);
    console.log('Loaded existing database!');
  });
}
