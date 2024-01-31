const AppErorr = require('../utlis/APPErorr');
const tour = require('./../models/tourModel');
const Tour = require('./../models/tourModel');
const catchasync = require('./../utlis/catchAsync');
const Factory = require('./handlerFactory');
exports.alaisTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,duration,price,ratingsAverage';
  next();
};

exports.GetAllTour = Factory.GetAll(Tour);
exports.CreateTour = Factory.CreateOne(Tour);
exports.GetTour = Factory.GetOne(Tour, { path: 'review' });
exports.updateTour = Factory.UpdateOne(Tour);
exports.deleteTour = Factory.DeleteOne(Tour);

exports.getToursStats = catchasync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        avgRate: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minprice: { $min: '$price' },
        maxprice: { $max: '$price' },
      },
    },
    {
      $sort: { avgRate: 1 },
    },
  ]);
  res.status(200).json({
    status: 'succes',
    data: {
      stats,
    },
  });
});

exports.getToursWithin = catchasync(async (req, res, next) => {
  const { distance, latlang, unit } = req.params;
  const [lat, lang] = latlang.split(',');

  const raduis = unit === 'mi' ? distance / 3958.7 : distance / 6371;

  if (!lat || !lang) {
    return next(new AppErorr('invaild latitude and langitude format', 400));
  }

  const data = await tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lang, lat], raduis] } },
  });
  res.status(200).json({
    status: 'success',
    result: data.length,
    data: {
      tours: data,
    },
  });
});

exports.getDistances = catchasync(async (req, res, next) => {
  const { lnglat, unit } = req.params;
  const [lat, lng] = lnglat.split(',');
  if (!lat || !lng) {
    return next(new AppErorr('invaild latitude and langitude format', 400));
  }
  const converter = unit === 'mi' ? 0.000621371 : 0.001;

  const stats = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: converter,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: stats.length,
    data: {
      data: stats,
    },
  });
});
