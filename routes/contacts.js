const router = require('express').Router();

const contactsController = require('../controllers/contacts');

router.get('/', (req, res) => {
  res.send('Contacts API Working');
});

router.get('/contacts', contactsController.getAll);
router.get('/contacts/:id', contactsController.getSingle);
router.post('/contacts', contactsController.createContact);
router.put('/contacts/:id', contactsController.updateContact);
router.delete('/contacts/:id', contactsController.deleteContact);

module.exports = router;