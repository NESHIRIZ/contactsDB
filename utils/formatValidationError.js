const formatValidationError = (error) => {
  if (error && error.errors) {
    return Object.values(error.errors).map((err) => err.message);
  }
  if (Array.isArray(error)) {
    return error;
  }
  return [error.message || 'Validation failed'];
};

module.exports = formatValidationError;
