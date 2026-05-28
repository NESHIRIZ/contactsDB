const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies');
const validateCompany = require('../middleware/validateCompany');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', companiesController.getAll);
router.get('/:id', validateObjectId, companiesController.getSingle);
router.post('/', validateCompany, companiesController.createCompany);
router.put('/:id', validateObjectId, validateCompany, companiesController.updateCompany);
router.delete('/:id', validateObjectId, companiesController.deleteCompany);

module.exports = router;
