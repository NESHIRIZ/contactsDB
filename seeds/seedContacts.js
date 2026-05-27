const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'contactsDB';

if (!uri) {
  console.error('Set MONGODB_URI in .env or environment variables before running this script.');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('contacts');

    const docs = [
      { firstName: 'Alice', lastName: 'Adams', email: 'alice@example.com', favoriteColor: 'Red', birthday: '1990-01-01' },
      { firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', favoriteColor: 'Blue', birthday: '1991-02-02' },
      { firstName: 'Carol', lastName: 'Clark', email: 'carol@example.com', favoriteColor: 'Green', birthday: '1992-03-03' },
      { firstName: 'Dave', lastName: 'Davis', email: 'dave@example.com', favoriteColor: 'Yellow', birthday: '1993-04-04' },
      { firstName: 'Eve', lastName: 'Evans', email: 'eve@example.com', favoriteColor: 'Purple', birthday: '1994-05-05' },
      { firstName: 'Frank', lastName: 'Foster', email: 'frank@example.com', favoriteColor: 'Orange', birthday: '1988-06-06' },
      { firstName: 'Grace', lastName: 'Green', email: 'grace@example.com', favoriteColor: 'Pink', birthday: '1989-07-07' },
      { firstName: 'Hannah', lastName: 'Hale', email: 'hannah@example.com', favoriteColor: 'Teal', birthday: '1995-08-08' },
      { firstName: 'Ian', lastName: 'Iverson', email: 'ian@example.com', favoriteColor: 'Gray', birthday: '1996-09-09' },
      { firstName: 'Jade', lastName: 'Jackson', email: 'jade@example.com', favoriteColor: 'Cyan', birthday: '1997-10-10' }
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
