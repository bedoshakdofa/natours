const AppError = require('./../utlis/APPErorr');

const handleCastError = (err) => {
  return new AppError(`invaild ${err.path}:${err.value}`, 400);
};

const handleDuplicateError = (err) => {
  const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/);
  return new AppError(`duplicate value at ${value}`, 400);
};

const handlevalidationError = (err) => {
  const mesg = Object.values(err.errors).map((el) => el.message);
  return new AppError(`invaild input ${mesg.join('. ')}`, 400);
};

const handleExpJwt = () => {
  return new AppError('token expired,please login', 401);
};
const handleJWTError = () => {
  return new AppError('invaild token please login again', 401);
};

const Errordev = (err, res) => {
  res.status(err.statusCode).json({
    stack: err.stack,
    status: err.status,
    message: err.message,
    error: err,
  });
};

const Errorprod = (err, res) => {
  if (err.isoperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'samthing went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    Errordev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      err = handleCastError(err);
    } else if (err.code === 11000) {
      err = handleDuplicateError(err);
    }
    if (err.name === 'ValidationError') {
      err = handlevalidationError(err);
    }
    if (err.name === 'TokenExpiredError') err = handleExpJwt();
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    Errorprod(err, res);
  }
};
