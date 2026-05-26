const router = require('express').Router();

const contactsController = require('../controllers/contacts');
const validateContact = require('../middleware/validateContact');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', contactsController.getAll);
router.get('/:id', validateObjectId, contactsController.getSingle);
router.post('/', validateContact, contactsController.createContact);
router.put('/:id', validateObjectId, validateContact, contactsController.updateContact);
router.delete('/:id', validateObjectId, contactsController.deleteContact);

module.exports = router;
