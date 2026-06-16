const router = require('express').Router();
const reviewsController = require('../controllers/reviews');
const validateReview = require('../middleware/validateReview');
const validateObjectId = require('../middleware/validateObjectId');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', reviewsController.getAll);
router.get('/:id', validateObjectId, reviewsController.getSingle);
router.post('/', isAuthenticated, validateReview, reviewsController.createReview);
router.put('/:id', isAuthenticated, validateObjectId, validateReview, reviewsController.updateReview);
router.delete('/:id', validateObjectId, reviewsController.deleteReview);

module.exports = router;
