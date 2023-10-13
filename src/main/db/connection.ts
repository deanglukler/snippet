import fs from 'fs';
import { DATABASE_PATH } from '../../CONST';
import Loki from 'lokijs';
import { COLLECTION } from './collection';

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

  private exists = false;
  private db: Promise<Loki> | null = null;

  constructor() {
    if (fs.existsSync(DATABASE_PATH)) {
      this.exists = true;
    }

    this.db = new Promise<Loki>((resolve) => {
      const db = new Loki(DATABASE_PATH);
      db.loadDatabase({}, () => {
        this.initDatabaseIfNecessary(db);
        resolve(db);
      });
    });
  }

  private initDatabaseIfNecessary(db: Loki) {
    if (!this.exists) {
      db.addCollection(COLLECTION.PREFERENCES);

      // check if all collections are present or throw
      for (const key in COLLECTION) {
        if (!db.getCollection(COLLECTION[key])) {
          throw new Error(`Collection ${COLLECTION[key]} not found`);
        }
      }

      this.exists = true;
    }
  }
}

const connection = Connection.getConnection();
export default connection;
