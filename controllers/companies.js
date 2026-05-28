const Company = require('../models/company');
const mongoose = require('mongoose');

const formatValidationError = (error) => {
  if (error && error.errors) {
    return Object.values(error.errors).map((err) => err.message);
  }
  if (Array.isArray(error)) {
    return error;
  }
  return [error.message || 'Validation failed'];
};

const getAll = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    return res.status(500).json({ error: 'Unable to fetch companies' });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid company id' });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.status(200).json(company);
  } catch (err) {
    console.error('Error fetching company:', err);
    return res.status(500).json({ error: 'Unable to fetch company' });
  }
};

const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    return res.status(201).json(company);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    console.error('Error creating company:', err);
    return res.status(500).json({ error: 'Unable to create company' });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid company id' });
    }

    const company = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.status(200).json(company);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    console.error('Error updating company:', err);
    return res.status(500).json({ error: 'Unable to update company' });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid company id' });
    }

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Error deleting company:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createCompany,
  updateCompany,
  deleteCompany,
};
