const User = require('./../models/UserModel');
const catchAsync = require('./../utlis/catchAsync');
exports.GetUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined',
  });
};
exports.DeleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.UpdateMe = catchAsync(async (req, res, next) => {
  const allowed = {
    name: req.body.name,
    email: req.body.email,
  };
  const UpdatedUser = await User.findByIdAndUpdate(req.user.id, allowed, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      UpdatedUser,
    },
  });
});

exports.UpdateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined',
  });
};
exports.GetAllUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined',
  });
};
exports.CreateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined',
  });
};
