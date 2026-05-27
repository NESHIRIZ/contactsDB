const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const requiredFields = ['name', 'industry', 'website', 'headquarters'];

const validateCompany = (req, res, next) => {
  const company = req.body || {};
  const errors = [];

  requiredFields.forEach((field) => {
    const value = company[field];
    if (value === undefined || value === null || String(value).trim().length === 0) {
      errors.push(`${field} is required`);
    } else {
      // normalize string values
      if (typeof value === 'string') {
        company[field] = value.trim();
      }
    }
  });

  if (company.website && !websiteRegex.test(String(company.website).trim())) {
    errors.push('website must be a valid URL');
  }

  if (company.foundedYear !== undefined && company.foundedYear !== null) {
    const yearNum = Number(company.foundedYear);
    if (!Number.isFinite(yearNum) || yearNum < 1800 || yearNum > new Date().getFullYear()) {
      errors.push(`foundedYear must be between 1800 and ${new Date().getFullYear()}`);
    } else {
      company.foundedYear = yearNum;
    }
  }

  if (company.employeeCount !== undefined && company.employeeCount !== null) {
    const countNum = Number(company.employeeCount);
    if (!Number.isFinite(countNum) || countNum < 1) {
      errors.push('employeeCount must be a positive number');
    } else {
      company.employeeCount = countNum;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateCompany;
