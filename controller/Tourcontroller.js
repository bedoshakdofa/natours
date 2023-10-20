const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utlis/apiFeatures');
// exports.CheckID = (req, res, next, val) => {
//   console.log(val);
//   if (req.params.id * 1 > data.length) {
//     return res.status(404).json({
//       status: 'fiald',
//       message: 'this id is not found',
//     });
//   }
//   next();
// };

// exports.CheckBody = (req, res, next) => {
//   if (!req.body.name && req.body.price) {
//     return res.status(400).json({
//       status: 'faild',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };
exports.alaisTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,duration,price,ratingsAverage';
  next();
};

exports.GetoneTour = async (req, res) => {
  try {
    //filtering
    // const queryobj = { ...req.query };
    // const excludefield = ['sort', 'limit', 'fields', 'page'];
    // excludefield.forEach((ele) => delete queryobj[ele]);
    // //adavance filter
    // let querySTR = JSON.stringify(queryobj);
    // querySTR = querySTR.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    // let query = Tour.find(JSON.parse(querySTR));

    //sort

    // if (req.query.sort) {
    //   const sortby = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortby);
    // }
    //limiting the fields
    // if (req.query.fields) {
    //   const field = req.query.fields.split(',').join(' ');
    //   query = query.select(field);
    // } else {
    //   query = query.select('-__v');
    // }

    //pagination
    // const limit = req.query.limit * 1 || 100;
    // const page = req.query.page * 1 || 1;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    //resloving the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .pagination()
      .limitfields();
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        result: tours.length,
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.CreateTour = async (req, res) => {
  try {
    const newtour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newtour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.GetTour = async (req, res) => {
  try {
    const getOneTour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tours: getOneTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'succes',
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'succes',
      data: {
        tour: deleteTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
