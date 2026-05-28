const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies');
const validateCompany = require('../middleware/validateCompany');
const validateObjectId = require('../middleware/validateObjectId');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', companiesController.getAll);
router.get('/:id', validateObjectId, companiesController.getSingle);
router.post('/', validateCompany, companiesController.createCompany);
router.put('/:id', validateObjectId, validateCompany, companiesController.updateCompany);
router.delete('/:id', validateObjectId, isAuthenticated, companiesController.deleteCompany);

module.exports = router;
