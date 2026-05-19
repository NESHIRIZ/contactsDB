const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Set MONGODB_URI in .env before running this script.');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('contactsDB');
    const collection = db.collection('contacts');

    const docs = [
      { firstName: 'Alice', lastName: 'Adams', email: 'alice@example.com', favoriteColor: 'Red', birthday: '1990-01-01' },
      { firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', favoriteColor: 'Blue', birthday: '1991-02-02' },
      { firstName: 'Carol', lastName: 'Clark', email: 'carol@example.com', favoriteColor: 'Green', birthday: '1992-03-03' },
      { firstName: 'Dave', lastName: 'Davis', email: 'dave@example.com', favoriteColor: 'Yellow', birthday: '1993-04-04' },
      { firstName: 'Eve', lastName: 'Evans', email: 'eve@example.com', favoriteColor: 'Purple', birthday: '1994-05-05' }
    ];

    const result = await collection.insertMany(docs);
    console.log(`Inserted ${result.insertedCount} contacts.`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();
