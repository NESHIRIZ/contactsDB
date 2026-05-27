const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'jobTitle', 'address', 'city', 'state', 'zip', 'favoriteColor', 'birthday'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContact = (req, res, next) => {
  const contact = req.body || {};
  const errors = [];

  requiredFields.forEach((field) => {
    const value = contact[field];
    if (value === undefined || value === null || String(value).trim().length === 0) {
      errors.push(`${field} is required`);
    } else {
      // normalize string values
      if (typeof value === 'string') {
        contact[field] = value.trim();
      }
    }
  });

  if (contact.email && !emailRegex.test(String(contact.email).trim())) {
    errors.push('email must be a valid email address');
  }

  if (contact.birthday && Number.isNaN(Date.parse(contact.birthday))) {
    errors.push('birthday must be a valid date');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateContact;
