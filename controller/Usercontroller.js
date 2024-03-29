const User = require('./../models/UserModel');
const catchAsync = require('./../utlis/catchAsync');
const Factory = require('./handlerFactory');

exports.DeleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.UpdateMe = catchAsync(async (req, res, next) => {
  const body = [req.body, req.file];
  console.log(body);
  const UpdatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { body },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      UpdatedUser,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      Me: me,
    },
  });
});

exports.GetUser = Factory.GetOne(User);
exports.GetAllUser = Factory.GetAll(User);
exports.UpdateUser = Factory.UpdateOne(User);
exports.deleteUser = Factory.DeleteOne(User);
