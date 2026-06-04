const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies');
const validateCompany = require('../middleware/validateCompany');
const validateObjectId = require('../middleware/validateObjectId');
const authenticate = require('../middleware/auth');

router.get('/', companiesController.getAll);
router.get('/:id', validateObjectId, companiesController.getSingle);
router.post('/', authenticate, validateCompany, companiesController.createCompany);
router.put('/:id', validateObjectId, authenticate, validateCompany, companiesController.updateCompany);
router.delete('/:id', validateObjectId, authenticate, companiesController.deleteCompany);

module.exports = router;
