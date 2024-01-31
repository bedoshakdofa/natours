const { promisify } = require('util');
const User = require('./../models/UserModel');
const catchasync = require('./../utlis/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utlis/APPErorr');
const sendEmail = require('./../utlis/email');
const crypto = require('crypto');

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
    role: req.body.role,
  });
  const token = signToken(newuser._id);
  res.status(200).json({
    status: 'succss',
    token,
    user: newuser,
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
  //if not found raise an error
  if (!token) {
    return next(new AppError('your are not login please login ', 401));
  }
  //verfify the token we take
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  //check if there a user for this token
  const currantuser = await User.findById(decode.id);

  if (!currantuser) {
    return next(new AppError('invaild email or password', 401));
  }
  // check if the user change the password after jwt issued
  if (currantuser.passwordchange(decode.iat)) {
    return next(new AppError('you have change your password recently ', 401));
  }
  req.user = currantuser;
  next();
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
    token,
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "you don/'t have the permison to perform this action",
          403,
        ),
      );
    }
    next();
  };
};

exports.forgetpassword = catchasync(async (req, res, next) => {
  const currantuser = await User.findOne({ email: req.body.email });
  if (!currantuser) {
    return next(new AppError('no user with this email ', 404));
  }

  const restToken = currantuser.passwordrestToken();
  await currantuser.save({ validateBeforeSave: false });

  const URL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/restpassword/${restToken}`;

  const message = `Forgot your password? 
  Submit a PATCH request with your new password and passwordConfirm to: ${URL}.
  \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: currantuser.email,
      subject: 'password rest token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token have been sent',
    });
  } catch (err) {
    currantuser.restToken = undefined;
    currantuser.passowrdTokenEXP = undefined;
    currantuser.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'there was error in sending email please try again leter',
        500,
      ),
    );
  }
});

exports.RestPassword = catchasync(async (req, res, next) => {
  const hastoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const currantuser = await User.findOne({
    restToken: hastoken,
    passowrdTokenEXP: { $gt: Date.now() },
  });

  if (!currantuser) {
    return next(new AppError('invaild token or expired', 401));
  }
  currantuser.password = req.body.password;
  currantuser.passwordconfirm = req.body.passwordconfirm;
  currantuser.restToken = undefined;
  currantuser.passowrdTokenEXP = undefined;
  await currantuser.save();

  const token = signToken(currantuser._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.UpdatePassword = catchasync(async (req, res, next) => {
  const currantuser = await User.findById(req.user.id).select('+password');

  if (
    !(await currantuser.CheckPassword(
      req.body.passwordCurrant,
      currantuser.password,
    ))
  ) {
    return next(new AppError('your password entered does not match ', 400));
  }

  currantuser.password = req.body.password;
  currantuser.passwordconfirm = req.body.passwordconfirm;
  await currantuser.save();

  const token = signToken(currantuser._id);
  res.status(200).json({
    status: 'sucess',
    token,
    currantuser,
  });
});
