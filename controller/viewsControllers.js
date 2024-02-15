const Tour = require('./../models/tourModel');
const catchAsync = require('./../utlis/catchAsync');
const Review = require('./../models/ReviewsModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTourView = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'review',
    fields: 'review rating user',
  });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginview = (req, res) => {
  res.status(200).render('login', {
    title: 'log into your account',
  });
};

exports.getsginup = (req, res) => {
  res.status(200).render('signup', {
    title: 'signup into your account',
  });
};
