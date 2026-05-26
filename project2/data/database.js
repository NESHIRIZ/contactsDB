const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'project2DB';

let database;

const initDb = async (callback) => {
  if (database) {
    console.log('Database already initialized');
    return callback(null, database);
  }

  if (!uri) {
    return callback(new Error('MONGODB_URI environment variable is required'));
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    database = client.db(dbName);
    callback(null, database);
  } catch (err) {
    callback(err);
  }
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDb
};
