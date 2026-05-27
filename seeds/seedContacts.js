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

    // Seed Companies
    const companiesCollection = db.collection('companies');
    const companies = [
      {
        name: 'Tech Innovations Inc',
        industry: 'Software Development',
        website: 'https://techinnovations.com',
        foundedYear: 2010,
        headquarters: 'San Francisco, CA',
        employeeCount: 150,
      },
      {
        name: 'Global Finance Solutions',
        industry: 'Financial Services',
        website: 'https://globalfinance.com',
        foundedYear: 2005,
        headquarters: 'New York, NY',
        employeeCount: 500,
      },
      {
        name: 'Healthcare Plus',
        industry: 'Healthcare',
        website: 'https://healthcareplus.com',
        foundedYear: 2015,
        headquarters: 'Boston, MA',
        employeeCount: 200,
      },
    ];

    const companiesResult = await companiesCollection.insertMany(companies);
    console.log(`Inserted ${companiesResult.insertedCount} companies.`);

    // Seed Contacts
    const contactsCollection = db.collection('contacts');
    const contacts = [
      {
        firstName: 'Alice',
        lastName: 'Adams',
        email: 'alice@example.com',
        phone: '(555) 123-4567',
        company: 'Tech Innovations Inc',
        jobTitle: 'Software Engineer',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        favoriteColor: 'Red',
        birthday: '1990-01-01',
      },
      {
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob@example.com',
        phone: '(555) 234-5678',
        company: 'Global Finance Solutions',
        jobTitle: 'Senior Analyst',
        address: '456 Wall Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        favoriteColor: 'Blue',
        birthday: '1991-02-02',
      },
      {
        firstName: 'Carol',
        lastName: 'Clark',
        email: 'carol@example.com',
        phone: '(555) 345-6789',
        company: 'Healthcare Plus',
        jobTitle: 'Nurse',
        address: '789 Medical Lane',
        city: 'Boston',
        state: 'MA',
        zip: '02101',
        favoriteColor: 'Green',
        birthday: '1992-03-03',
      },
      {
        firstName: 'Dave',
        lastName: 'Davis',
        email: 'dave@example.com',
        phone: '(555) 456-7890',
        company: 'Tech Innovations Inc',
        jobTitle: 'Project Manager',
        address: '321 Market St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        favoriteColor: 'Yellow',
        birthday: '1993-04-04',
      },
      {
        firstName: 'Eve',
        lastName: 'Evans',
        email: 'eve@example.com',
        phone: '(555) 567-8901',
        company: 'Global Finance Solutions',
        jobTitle: 'Risk Manager',
        address: '654 Broadway',
        city: 'New York',
        state: 'NY',
        zip: '10002',
        favoriteColor: 'Purple',
        birthday: '1994-05-05',
      },
      {
        firstName: 'Frank',
        lastName: 'Foster',
        email: 'frank@example.com',
        phone: '(555) 678-9012',
        company: 'Healthcare Plus',
        jobTitle: 'Doctor',
        address: '987 Health Ave',
        city: 'Boston',
        state: 'MA',
        zip: '02102',
        favoriteColor: 'Orange',
        birthday: '1988-06-06',
      },
      {
        firstName: 'Grace',
        lastName: 'Green',
        email: 'grace@example.com',
        phone: '(555) 789-0123',
        company: 'Tech Innovations Inc',
        jobTitle: 'UX Designer',
        address: '111 Design Drive',
        city: 'San Francisco',
        state: 'CA',
        zip: '94104',
        favoriteColor: 'Pink',
        birthday: '1989-07-07',
      },
      {
        firstName: 'Hannah',
        lastName: 'Hale',
        email: 'hannah@example.com',
        phone: '(555) 890-1234',
        company: 'Global Finance Solutions',
        jobTitle: 'Accountant',
        address: '222 Finance Blvd',
        city: 'New York',
        state: 'NY',
        zip: '10003',
        favoriteColor: 'Teal',
        birthday: '1995-08-08',
      },
      {
        firstName: 'Ian',
        lastName: 'Iverson',
        email: 'ian@example.com',
        phone: '(555) 901-2345',
        company: 'Healthcare Plus',
        jobTitle: 'Administrator',
        address: '333 Clinic Ctr',
        city: 'Boston',
        state: 'MA',
        zip: '02103',
        favoriteColor: 'Gray',
        birthday: '1996-09-09',
      },
      {
        firstName: 'Jade',
        lastName: 'Jackson',
        email: 'jade@example.com',
        phone: '(555) 012-3456',
        company: 'Tech Innovations Inc',
        jobTitle: 'DevOps Engineer',
        address: '444 Cloud Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        favoriteColor: 'Cyan',
        birthday: '1997-10-10',
      },
    ];

    const contactsResult = await contactsCollection.insertMany(contacts);
    console.log(`Inserted ${contactsResult.insertedCount} contacts.`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();
