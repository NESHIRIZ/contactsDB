const router = require('express').Router();

const contactsController = require('../controllers/contacts');
const validateContact = require('../middleware/validateContact');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', (req, res) => {
  res.json({ status: 'Contacts API is running' });
});

router.get('/contacts', contactsController.getAll);
router.get('/contacts/:id', validateObjectId, contactsController.getSingle);
router.post('/contacts', validateContact, contactsController.createContact);
router.put('/contacts/:id', validateObjectId, validateContact, contactsController.updateContact);
router.delete('/contacts/:id', validateObjectId, contactsController.deleteContact);

module.exports = router;