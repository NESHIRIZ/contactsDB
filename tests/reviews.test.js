const request = require('supertest');
const app = require('../server');
const Review = require('../models/review');
jest.mock('../models/review');

jest.setTimeout(30000);

describe('Reviews API', () => {
  const reviewId = '507f1f77bcf86cd799439014';
  const reviewData = {
    id: reviewId,
    title: 'Great Product!',
    content: 'This product exceeded my expectations',
    rating: 5,
    author: 'Jane Doe',
    email: 'jane@example.com',
    productId: '507f1f77bcf86cd799439013',
    helpful: 10,
  };

  beforeEach(() => {
    Review.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([reviewData]),
    });
    Review.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(reviewData),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reviews', () => {
    it('should return all reviews with 200 status', async () => {
      const response = await request(app).get('/reviews');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(reviewId);
    });

    it('should return review objects with required fields', async () => {
      const response = await request(app).get('/reviews');
      expect(response.status).toBe(200);
      const review = response.body[0];
      expect(review).toHaveProperty('id');
      expect(review).toHaveProperty('title');
      expect(review).toHaveProperty('rating');
      expect(review).toHaveProperty('productId');
    });
  });

  describe('GET /reviews/:id', () => {
    it('should return a single review with 200 status', async () => {
      const response = await request(app).get(`/reviews/${reviewId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(reviewId);
      expect(response.body.title).toBe('Great Product!');
    });

    it('should return 404 for non-existent review', async () => {
      Review.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      const response = await request(app).get(`/reviews/${reviewId}`);
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/reviews/invalid-id');
      expect(response.status).toBe(400);
    });
  });
});
