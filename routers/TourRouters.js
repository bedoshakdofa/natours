const express = require('express');
const tour = require('./../controller/Tourcontroller');
const router = express.Router();

//router.param('id', tour.CheckID);
router.route('/stats-data').get(tour.getToursStats);
router.route('/top-5-cheep').get(tour.alaisTour, tour.GetAllTour);

router.route('/').get(tour.GetAllTour).post(tour.CreateTour);

router
  .route('/:id')
  .get(tour.GetTour)
  .patch(tour.updateTour)
  .delete(tour.deleteTour);

module.exports = router;
