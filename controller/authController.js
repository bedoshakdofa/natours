const { promisify } = require('util');
const User = require('./../models/UserModel');
const catchasync = require('./../utlis/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utlis/APPErorr');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '90d',
  });
};

exports.signup = catchasync(async (req, res, next) => {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm,
  });
  const token = signToken(newuser._id);
  res.status(200).json({
    status: 'succss',
    token,
    user: newuser,
  });
});

exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please provide an Email and Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.CheckPassword(password, user.password)))
    return next(new AppError('invaild Email or password', 401));

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

exports.protect = catchasync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('your not logged in, please log in ', 401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );

  const currantuser = await User.findById(decoded.id);

  if (!currantuser) {
    return next(new AppError('your are not user plz sign in', 401));
  }

  if (currantuser.passwordchange(decoded.iat)) {
    return next(
      new AppError('you have change your password, plz login again', 401),
    );
  }
  req.user = currantuser;
  next();
});
