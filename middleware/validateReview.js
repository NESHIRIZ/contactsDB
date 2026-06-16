const mongoose = require('mongoose');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredFields = ['title', 'content', 'rating', 'author', 'email', 'productId'];

const validateReview = (req, res, next) => {
  const review = req.body || {};
  const errors = [];

  requiredFields.forEach((field) => {
    const value = review[field];
    if (value === undefined || value === null || String(value).trim().length === 0) {
      errors.push(`${field} is required`);
    } else if (typeof value === 'string') {
      review[field] = value.trim();
    }
  });

  // Validate rating
  if (review.rating !== undefined && review.rating !== null) {
    const rating = Number(review.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      errors.push('rating must be an integer between 1 and 5');
    } else {
      review.rating = rating;
    }
  }

  // Validate email
  if (review.email && !emailRegex.test(String(review.email).trim())) {
    errors.push('email must be a valid email address');
  }

  // Validate productId
  if (review.productId && !mongoose.Types.ObjectId.isValid(review.productId)) {
    errors.push('productId must be a valid MongoDB ID');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateReview;
