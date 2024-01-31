const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');
const tour = require('./../controller/Tourcontroller');
const ReviewRouter = require('./../routers/ReviewRouters');

router.use('/:tourID/reviews', ReviewRouter);

router.route('/top-5-cheep').get(tour.alaisTour, tour.GetAllTour);

router.route('/stats-data').get(tour.getToursStats);

router
  .route('/')
  .get(tour.GetAllTour)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tour.CreateTour,
  );

router
  .route('/tours-within/:distance/center/:latlang/unit/:unit')
  .get(tour.getToursWithin);

router.route('/distances/:lnglat/unit/:unit').get(tour.getDistances);
router
  .route('/:id')
  .get(tour.GetTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tour.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tour.deleteTour,
  );

module.exports = router;
