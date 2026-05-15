const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

const validateContact = (contact) => {
  return requiredFields.every((field) => contact[field]);
};

const getAll = async (req, res) => {
  try {
    const contacts = await mongodb
      .getDb()
      .db('contactsDB')
      .collection('contacts')
      .find()
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch contacts' });
  }
};

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const contact = await mongodb
      .getDb()
      .db('contactsDB')
      .collection('contacts')
      .findOne({ _id: userId });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ error: 'Invalid contact id' });
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

  if (!validateContact(contact)) {
    return res.status(400).json({ error: 'All contact fields are required' });
  }

  try {
    const response = await mongodb
      .getDb()
      .db('contactsDB')
      .collection('contacts')
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ error: 'Unable to create contact' });
    }
  } catch (err) {
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

    if (!validateContact(contact)) {
      return res.status(400).json({ error: 'All contact fields are required' });
    }

    const response = await mongodb
      .getDb()
      .db('contactsDB')
      .collection('contacts')
      .updateOne({ _id: userId }, { $set: contact });

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Invalid contact id' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('contactsDB')
      .collection('contacts')
      .deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Invalid contact id' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};