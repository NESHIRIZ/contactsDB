const Contact = require('../models/contact');
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
    const contacts = await Contact.find();
    return res.status(200).json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    return res.status(500).json({ error: 'Unable to fetch contacts' });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(200).json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err);
    return res.status(500).json({ error: 'Unable to fetch contact' });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    return res.status(201).json(contact);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    console.error('Error creating contact:', err);
    return res.status(500).json({ error: 'Unable to create contact' });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const contact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(200).json(contact);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: formatValidationError(err) });
    }
    console.error('Error updating contact:', err);
    return res.status(500).json({ error: 'Unable to update contact' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    return res.status(500).json({ error: 'Unable to delete contact' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
