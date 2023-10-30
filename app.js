//core module
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utlis/APPErorr');
const tourRouter = require('./routers/TourRouters');
const userRouter = require('./routers/UserRouter');
//express
const app = express();
//middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find this ${req.originalUrl} `, 404));
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
