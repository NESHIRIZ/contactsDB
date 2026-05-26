const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContact = (req, res, next) => {
  const contact = req.body || {};
  const errors = [];

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

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateContact;
