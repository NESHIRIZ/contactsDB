const { ObjectId } = require('mongodb');

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid contact id' });
  }

  next();
};

module.exports = validateObjectId;
