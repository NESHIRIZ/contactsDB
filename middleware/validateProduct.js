const requiredFields = ['name', 'description', 'price', 'quantity', 'category', 'sku'];

const validateProduct = (req, res, next) => {
  const product = req.body || {};
  const errors = [];

  requiredFields.forEach((field) => {
    const value = product[field];
    if (value === undefined || value === null || String(value).trim().length === 0) {
      errors.push(`${field} is required`);
    } else if (typeof value === 'string') {
      product[field] = value.trim();
    }
  });

  // Validate price
  if (product.price !== undefined && product.price !== null) {
    const price = Number(product.price);
    if (!Number.isFinite(price) || price < 0) {
      errors.push('price must be a positive number');
    } else {
      product.price = price;
    }
  }

  // Validate quantity
  if (product.quantity !== undefined && product.quantity !== null) {
    const qty = Number(product.quantity);
    if (!Number.isFinite(qty) || qty < 0 || !Number.isInteger(qty)) {
      errors.push('quantity must be a non-negative integer');
    } else {
      product.quantity = qty;
    }
  }

  // Validate SKU format (should be uppercase alphanumeric)
  if (product.sku && !/^[A-Z0-9]+$/.test(product.sku.toUpperCase())) {
    errors.push('SKU must contain only letters and numbers');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateProduct;
