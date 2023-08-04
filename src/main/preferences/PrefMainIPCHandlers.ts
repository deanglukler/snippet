function getPreferences() {
  async function stuff() {
    const db = await database;
    db.getCollection(COLLECTION.PREFERENCES).find().forEach(console.log);
  }
  stuff();
}

export default {
  getPreferences,
};
