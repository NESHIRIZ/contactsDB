const request = require('supertest');
const app = require('../server');
const Company = require('../models/company');
jest.mock('../models/company');

jest.setTimeout(30000);

describe('Companies API', () => {
  const companyId = '507f1f77bcf86cd799439012';
  const companyData = {
    id: companyId,
    name: 'Acme Corporation',
    industry: 'Technology',
    website: 'https://acme.com',
    foundedYear: 2000,
    headquarters: 'New York, NY',
    employeeCount: 500,
  };

  beforeEach(() => {
    Company.find.mockResolvedValue([companyData]);
    Company.findById.mockResolvedValue(companyData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /companies', () => {
    it('should return all companies with 200 status', async () => {
      const response = await request(app).get('/companies');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(companyId);
    });

    it('should return company objects with required fields', async () => {
      const response = await request(app).get('/companies');
      expect(response.status).toBe(200);
      const company = response.body[0];
      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('name');
      expect(company).toHaveProperty('industry');
    });
  });

  describe('GET /companies/:id', () => {
    it('should return a single company with 200 status', async () => {
      const response = await request(app).get(`/companies/${companyId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(companyId);
      expect(response.body.name).toBe('Acme Corporation');
    });

    it('should return 404 for non-existent company', async () => {
      Company.findById.mockResolvedValue(null);
      const response = await request(app).get(`/companies/${companyId}`);
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/companies/invalid-id');
      expect(response.status).toBe(400);
    });
  });
});
