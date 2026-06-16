const request = require('supertest');
const app = require('../server');
const Contact = require('../models/contact');
jest.mock('../models/contact');

jest.setTimeout(30000);

describe('Contacts API', () => {
  const contactId = '507f1f77bcf86cd799439011';
  const contactData = {
    id: contactId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-1234',
    company: 'Acme Corp',
    jobTitle: 'Developer',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    favoriteColor: 'blue',
    birthday: '1990-01-01',
  };

  beforeEach(() => {
    Contact.find.mockResolvedValue([contactData]);
    Contact.findById.mockResolvedValue(contactData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /contacts', () => {
    it('should return all contacts with 200 status', async () => {
      const response = await request(app).get('/contacts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(contactId);
    });

    it('should return contact objects with required fields', async () => {
      const response = await request(app).get('/contacts');
      expect(response.status).toBe(200);
      const contact = response.body[0];
      expect(contact).toHaveProperty('id');
      expect(contact).toHaveProperty('firstName');
      expect(contact).toHaveProperty('email');
    });
  });

  describe('GET /contacts/:id', () => {
    it('should return a single contact with 200 status', async () => {
      const response = await request(app).get(`/contacts/${contactId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe('John');
    });

    it('should return 404 for non-existent contact', async () => {
      Contact.findById.mockResolvedValue(null);
      const response = await request(app).get(`/contacts/${contactId}`);
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/contacts/invalid-id');
      expect(response.status).toBe(400);
    });
  });
});
