import { app, ipcMain } from 'electron';
import fs from 'fs';
import Loki from 'lokijs';
import path from 'path';

const DB_PATH = path.join(app.getPath('desktop'), 'SNIP_TEST.lokidb');

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
  createDatabase();
} else {
  // Load the existing database from disk

  const db = new Loki(DB_PATH);
  db.loadDatabase({}, () => {
    init(db);
    console.log('Loaded existing database!');
  });
}

function createDatabase() {
  const db = new Loki(DB_PATH, { autosave: true, autosaveInterval: 10 });

  const inputValue = db.addCollection<{ value: string }>('inputValue');

  inputValue.insert({ value: 'initial value' });

  console.log('Initialized new database!');
}
