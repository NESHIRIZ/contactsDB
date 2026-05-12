const router = require('express').Router();

const contactsController = require('../controllers/contacts');

router.get('/', (req, res) => {
  res.send('Contacts API Working');
});

router.get('/contacts', contactsController.getAll);

router.get('/contacts/:id', contactsController.getSingle);

module.exports = router;