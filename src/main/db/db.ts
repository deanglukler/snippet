import { DBModels, LokiItem } from '../../types';
import connection from './connection';

async function insert<T extends keyof DBModels>(
  collection: T,
  data: DBModels[T]
) {
  const db = await connection;
  const col = db.getCollection<DBModels[T]>(collection);
  const item = col.insert(data) as LokiItem<DBModels[T]>;
  db.saveDatabase();
  return item;
}

async function update<T extends keyof DBModels = keyof DBModels>(
  collection: T,
  $loki: number,
  data: Partial<DBModels[T]>
) {
  const db = await connection;
  const item = await select(collection, $loki);
  for (const key in data) {
    // @ts-ignore
    item[key] = data[key];
  }
  db.saveDatabase();
  return item;
}

async function updateBy<T extends keyof DBModels>(
  collection: T,
  query: Partial<DBModels[T] & { $loki: number }>,
  data: Partial<DBModels[T]>
) {
  const res = await selectBy<T>(collection, query);
  const item = res[0];
  if (!item) {
    throw new Error('Attempted to update non-existent item :S');
  }
  await update(collection, item.$loki, data);
}

async function selectAll<T extends keyof DBModels>(collection: T) {
  const db = await connection;
  const col = db.getCollection<DBModels[T]>(collection);
  return col.find();
}

async function selectBy<T extends keyof DBModels>(
  collection: T,
  query: Partial<DBModels[T] & { $loki: number }>
) {
  const db = await connection;
  const col = db.getCollection<DBModels[T]>(collection);
  // @ts-ignore
  return col.find(query);
}

async function select<T extends keyof DBModels>(collection: T, $loki: number) {
  const db = await connection;
  const col = db.getCollection<DBModels[T]>(collection);
  const item = col.get($loki);
  return item;
}

async function deleteBy<T extends keyof DBModels>(
  collection: T,
  query: Partial<DBModels[T] & { $loki: number }>
) {
  const db = await connection;
  const col = db.getCollection<DBModels[T]>(collection);
  // @ts-ignore
  return col.findAndRemove(query);
}

export default {
  insert,
  update,
  updateBy,
  select,
  selectAll,
  selectBy,
  deleteBy,
};
