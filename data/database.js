const mongodb = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'contactsDB';
const { MongoClient } = mongodb;

let client;
let db;

const initDb = async (callback) => {
  if (db) {
    return callback(null, db);
  }

  if (!uri) {
    return callback(new Error('MONGODB_URI environment variable is required'));
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    callback(null, db);
  } catch (error) {
    callback(error);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  return db;
};

module.exports = {
  initDb,
  getDb
};