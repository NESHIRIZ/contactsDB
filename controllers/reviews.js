const Review = require('../models/review');
const mongoose = require('mongoose');
const formatValidationError = require('../utils/formatValidationError');

const getAll = async (req, res) => {
  try {
    const reviews = await Review.find().populate('productId');
    return res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({ error: 'Unable to fetch reviews' });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review id' });
    }

    const review = await Review.findById(id).populate('productId');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json(review);
  } catch (err) {
    console.error('Error fetching review:', err);
    return res.status(500).json({ error: 'Unable to fetch review' });
  }
};

const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    await review.populate('productId');
    return res.status(201).json(review);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    console.error('Error creating review:', err);
    return res.status(500).json({ error: 'Unable to create review' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review id' });
    }

    const review = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    }).populate('productId');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json(review);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    console.error('Error updating review:', err);
    return res.status(500).json({ error: 'Unable to update review' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review id' });
    }

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    return res.status(500).json({ error: 'Unable to delete review' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createReview,
  updateReview,
  deleteReview,
};
