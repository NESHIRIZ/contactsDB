const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const requiredFields = ['title', 'authorId', 'summary', 'genre', 'publisher', 'publishedDate', 'pages', 'isbn'];

const validateBook = (book) => {
  return requiredFields.every((field) => book[field]);
};

const getAll = async (req, res) => {
  try {
    const books = await mongodb.getDb().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch books' });
  }
};

const getSingle = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const book = await mongodb.getDb().collection('books').findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: 'Invalid book id' });
  }
};

const createBook = async (req, res) => {
  const book = {
    title: req.body.title,
    authorId: req.body.authorId,
    summary: req.body.summary,
    genre: req.body.genre,
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    pages: req.body.pages,
    isbn: req.body.isbn
  };

  if (!validateBook(book)) {
    return res.status(400).json({ error: 'All book fields are required' });
  }

  try {
    const response = await mongodb.getDb().collection('books').insertOne(book);
    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Unable to create book' });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const book = {
      title: req.body.title,
      authorId: req.body.authorId,
      summary: req.body.summary,
      genre: req.body.genre,
      publisher: req.body.publisher,
      publishedDate: req.body.publishedDate,
      pages: req.body.pages,
      isbn: req.body.isbn
    };

    if (!validateBook(book)) {
      return res.status(400).json({ error: 'All book fields are required' });
    }

    const response = await mongodb.getDb().collection('books').updateOne({ _id: bookId }, { $set: book });
    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Invalid book id' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('books').deleteOne({ _id: bookId });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Invalid book id' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook
};
