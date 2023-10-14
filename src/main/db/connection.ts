import { DATABASE_PATH } from '../../CONST';
import Loki from 'lokijs';
import { COLLECTION } from './collection';
import log from '../log';

function checkDatabaseCollections(db: Loki) {
  for (const key in COLLECTION) {
    log('Checking for existance of collection ' + COLLECTION[key]);
    if (!db.getCollection(COLLECTION[key])) {
      log('Collection ' + COLLECTION[key] + ' not found, creating...');
      db.addCollection(COLLECTION[key]);
    }
  }

  log('Collections all exist!');
}

class Connection {
  private static instance: Connection;

  static async getConnection() {
    if (!Connection.instance) {
      Connection.instance = new Connection();
    }
    const connection = await Connection.instance.db;
    if (!connection) {
      throw new Error('Connection not found :S');
    }
    return connection;
  }

  private db: Promise<Loki> | null = null;

  constructor() {
    this.db = new Promise<Loki>((resolve) => {
      const db = new Loki(DATABASE_PATH);
      db.loadDatabase({}, () => {
        checkDatabaseCollections(db);
        resolve(db);
      });
    });
  }
}

const connection = Connection.getConnection();
export default connection;
