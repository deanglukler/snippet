import { DB } from '../types';
import dbPromise from './database';

type DBCollection = keyof DB;

async function insert<T extends DBCollection = DBCollection>(
  data: DB[T],
  collection: T
) {
  const db = await dbPromise;
  const col = db.getCollection<DB[T]>(collection);
  col.insert(data);
  db.saveDatabase();
}

async function update<T extends DBCollection = DBCollection>(
  data: Partial<DB[T]>,
  collection: T,
  id: number
) {
  const db = await dbPromise;
  const col = db.getCollection<DB[T]>(collection);
  const item = col.get(id);
  for (const key in data) {
    // @ts-ignore
    item[key] = data[key];
  }
  col.update(item);
  db.saveDatabase();
}

export default {
  insert,
  update,
};
