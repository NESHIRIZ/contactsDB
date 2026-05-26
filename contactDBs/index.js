const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI environment variable is required');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  tls: true
});

async function run() {
  try {
    await client.connect();

    console.log('Connected to MongoDB ✅');

    const db = client.db(process.env.MONGODB_DB || 'byu_project');
    const collection = db.collection('students');

    const result = await collection.insertOne({
      name: 'Tafadzwa',
      school: 'BYU Pathway'
    });

    console.log('Data inserted ✅');
    console.log(result);
  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await client.close();
  }
}

run();