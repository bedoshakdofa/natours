const Tour = require('./../models/tourModel');
const AppError = require('./../utlis/APPErorr');
const APIFeatures = require('./../utlis/apiFeatures');
const catchasync = require('./../utlis/catchAsync');
exports.alaisTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,duration,price,ratingsAverage';
  next();
};

exports.GetAllTour = catchasync(async (req, res, next) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      result: tours.length,
      tours,
    },
  });
});

exports.CreateTour = catchasync(async (req, res, next) => {
  const newtour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newtour,
    },
  });
});

exports.GetTour = catchasync(async (req, res, next) => {
  const getOneTour = await Tour.findById(req.params.id);
  if (!getOneTour) {
    return next(new AppError(`id not found `, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours: getOneTour,
    },
  });
});

exports.updateTour = catchasync(async (req, res, next) => {
  const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updateTour) {
    return next(new AppError(`item not found to update `, 404));
  }
  res.status(200).json({
    status: 'succes',
    data: {
      tour: updateTour,
    },
  });
});

exports.deleteTour = catchasync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('item not found to delete', 404));
  }
  res.status(204).json({
    status: 'succes',
    data: {
      tour,
    },
  });
});

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
