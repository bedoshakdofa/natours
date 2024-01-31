const express = require('express');
const router = express.Router({ mergeParams: true });
const ReviewController = require('./../controller/ReviewController');
const Auth = require('./../controller/authController');

router.use(Auth.protect);

router
  .route('/')
  .get(ReviewController.GetAllReview)
  .post(Auth.restrictTo('user'), ReviewController.CreateReview);

router
  .route('/:id')
  .get(ReviewController.GetOneReview)
  .delete(Auth.restrictTo('user', 'admin'), ReviewController.deleteReview)
  .patch(Auth.restrictTo('user', 'admin'), ReviewController.UpdateReview);
module.exports = router;
