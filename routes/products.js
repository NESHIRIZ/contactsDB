const router = require('express').Router();
const productsController = require('../controllers/products');
const validateProduct = require('../middleware/validateProduct');
const validateObjectId = require('../middleware/validateObjectId');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', productsController.getAll);
router.get('/:id', validateObjectId, productsController.getSingle);
router.post('/', isAuthenticated, validateProduct, productsController.createProduct);
router.put('/:id', isAuthenticated, validateObjectId, validateProduct, productsController.updateProduct);
router.delete('/:id', validateObjectId, productsController.deleteProduct);

module.exports = router;
