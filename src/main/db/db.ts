import { DB } from '../../types';
import connection from './connection';

type DBCollection = keyof DB;

async function insert<T extends DBCollection = DBCollection>(
  collection: T,
  data: DB[T]
) {
  const db = await connection;
  const col = db.getCollection<DB[T]>(collection);
  col.insert(data);
  db.saveDatabase();
}

async function update<T extends DBCollection = DBCollection>(
  data: Partial<DB[T]>,
  collection: T,
  id: number
) {
  const db = await connection;
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
