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
    return res.status(200).json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    return res.status(500).json({ error: 'Unable to fetch contacts' });
  }
};

const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const userId = new ObjectId(id);
    const contact = await mongodb.getDb().collection('contacts').findOne({ _id: userId });

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
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    // If age provided, coerce to number
    if (req.body.age !== undefined) {
      const ageNum = Number(req.body.age);
      if (!Number.isFinite(ageNum)) {
        return res.status(400).json({ errors: ['age must be a number'] });
      }
      contact.age = ageNum;
    }

    const errors = validateContactPayload(contact);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const response = await mongodb.getDb().collection('contacts').insertOne(contact);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Unable to create contact' });
    }

    return res.status(201).json({ id: response.insertedId });
  } catch (err) {
    console.error('Error creating contact:', err);
    return res.status(500).json({ error: 'Unable to create contact' });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const userId = new ObjectId(id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    if (req.body.age !== undefined) {
      const ageNum = Number(req.body.age);
      if (!Number.isFinite(ageNum)) {
        return res.status(400).json({ errors: ['age must be a number'] });
      }
      contact.age = ageNum;
    }

    const errors = validateContactPayload(contact);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const response = await mongodb.getDb().collection('contacts').updateOne({ _id: userId }, { $set: contact });

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Error updating contact:', err);
    return res.status(500).json({ error: 'Unable to update contact' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contact id' });
    }

    const userId = new ObjectId(id);
    const response = await mongodb.getDb().collection('contacts').deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(204).send();
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
  deleteContact
};