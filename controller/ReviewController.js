const catchAsync = require('./../utlis/catchAsync');
const Reviews = require('./../models/ReviewsModel');
const Factory = require('./handlerFactory');

exports.CreateReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Reviews.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.GetAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourID) filter = { tour: req.params.tourID };
  const review = await Reviews.find(filter);
  res.status(200).json({
    status: 'sucess',
    data: {
      review,
    },
  });
});

exports.UpdateReview = Factory.UpdateOne(Reviews);
exports.deleteReview = Factory.DeleteOne(Reviews);
exports.GetOneReview = Factory.GetOne(Reviews);
