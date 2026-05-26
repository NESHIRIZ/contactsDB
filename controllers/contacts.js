const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContactPayload = (contact) => {
  const errors = [];
  const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

  requiredFields.forEach((field) => {
    if (!contact[field] || String(contact[field]).trim().length === 0) {
      errors.push(`${field} is required`);
    }
  });

  if (contact.email && !emailRegex.test(String(contact.email).trim())) {
    errors.push('email must be a valid email address');
  }

  if (contact.birthday && Number.isNaN(Date.parse(contact.birthday))) {
    errors.push('birthday must be a valid date');
  }

  if (contact.age !== undefined && typeof contact.age !== 'number') {
    errors.push('age must be a number');
  }

  return errors;
};

const getAll = async (req, res) => {
  try {
    const contacts = await mongodb.getDb().collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Unable to fetch contacts' });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const contact = await mongodb.getDb().collection('contacts').findOne({ _id: userId });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ error: 'Unable to fetch contact' });
  }
};

const createContact = async (req, res) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };

  const errors = validateContactPayload(contact);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const response = await mongodb.getDb().collection('contacts').insertOne(contact);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Unable to create contact' });
    }

    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    console.error('Error creating contact:', err);
    res.status(500).json({ error: 'Unable to create contact' });
  }
};

const updateContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const errors = validateContactPayload(contact);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const response = await mongodb.getDb().collection('contacts').updateOne({ _id: userId }, { $set: contact });

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: 'Unable to update contact' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('contacts').deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: 'Unable to delete contact' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};