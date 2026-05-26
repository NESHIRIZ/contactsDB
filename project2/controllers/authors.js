const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const requiredFields = ['firstName', 'lastName', 'bio', 'birthDate', 'nationality', 'website', 'genres', 'awards'];

const validateAuthor = (author) => {
  return requiredFields.every((field) => author[field]);
};

const getAll = async (req, res) => {
  try {
    const authors = await mongodb.getDb().collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch authors' });
  }
};

const getSingle = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const author = await mongodb.getDb().collection('authors').findOne({ _id: authorId });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (err) {
    res.status(400).json({ error: 'Invalid author id' });
  }
};

const createAuthor = async (req, res) => {
  const author = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    birthDate: req.body.birthDate,
    nationality: req.body.nationality,
    website: req.body.website,
    genres: req.body.genres,
    awards: req.body.awards
  };

  if (!validateAuthor(author)) {
    return res.status(400).json({ error: 'All author fields are required' });
  }

  try {
    const response = await mongodb.getDb().collection('authors').insertOne(author);
    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Unable to create author' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      birthDate: req.body.birthDate,
      nationality: req.body.nationality,
      website: req.body.website,
      genres: req.body.genres,
      awards: req.body.awards
    };

    if (!validateAuthor(author)) {
      return res.status(400).json({ error: 'All author fields are required' });
    }

    const response = await mongodb.getDb().collection('authors').updateOne({ _id: authorId }, { $set: author });
    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Invalid author id' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('authors').deleteOne({ _id: authorId });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Invalid author id' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
