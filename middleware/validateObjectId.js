const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid contact id' });
  }

  next();
};

module.exports = validateObjectId;
