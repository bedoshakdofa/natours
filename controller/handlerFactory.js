const catchasync = require('./../utlis/catchAsync');
const AppError = require('./../utlis/APPErorr');
const APIFeatures = require('./../utlis/apiFeatures');
exports.DeleteOne = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('item not found to delete', 404));
    }
    res.status(204).json({
      status: 'succes',
      data: {
        doc,
      },
    });
  });

exports.UpdateOne = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(`item not found to update `, 404));
    }
    res.status(200).json({
      status: 'succes',
      data: {
        date: doc,
      },
    });
  });

exports.CreateOne = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.GetOne = (Model, popOption) =>
  catchasync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query.populate(popOption);
    const doc = await query;
    if (!doc) {
      return next(new AppError(`id not found `, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.GetAll = (Model) =>
  catchasync(async (req, res, next) => {
    const features = new APIFeatures(Model, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        result: doc.length,
        data: doc,
      },
    });
  });
