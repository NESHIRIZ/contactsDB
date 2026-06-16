const request = require('supertest');
const app = require('../server');
const Product = require('../models/product');
jest.mock('../models/product');

jest.setTimeout(30000);

describe('Products API', () => {
  const productId = '507f1f77bcf86cd799439013';
  const productData = {
    id: productId,
    name: 'Widget Pro',
    description: 'Professional grade widget for all your needs',
    price: 99.99,
    quantity: 100,
    category: 'Widgets',
    sku: 'WID001',
    inStock: true,
  };

  beforeEach(() => {
    Product.find.mockResolvedValue([productData]);
    Product.findById.mockResolvedValue(productData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return all products with 200 status', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(productId);
    });

    it('should return product objects with required fields', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      const product = response.body[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('sku');
      expect(product).toHaveProperty('price');
    });
  });

  describe('GET /products/:id', () => {
    it('should return a single product with 200 status', async () => {
      const response = await request(app).get(`/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe('Widget Pro');
    });

    it('should return 404 for non-existent product', async () => {
      Product.findById.mockResolvedValue(null);
      const response = await request(app).get(`/products/${productId}`);
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/products/invalid-id');
      expect(response.status).toBe(400);
    });
  });
});
