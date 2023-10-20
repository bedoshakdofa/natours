const express = require('express');
const tour = require('./../controller/Tourcontroller');
const router = express.Router();

//router.param('id', tour.CheckID);
router.route('/top-5-cheep').get(tour.alaisTour, tour.GetoneTour);

router.route('/').get(tour.GetoneTour).post(tour.CreateTour);

router
  .route('/:id')
  .get(tour.GetTour)
  .patch(tour.updateTour)
  .delete(tour.deleteTour);

module.exports = router;
