//core module
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utlis/APPErorr');
const tourRouter = require('./routers/TourRouters');
const userRouter = require('./routers/UserRouter');
const Erorr = require('./controller/Errorcontroller');
//express
const app = express();
//middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
console.log(process.env.NODE_ENV);
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find this ${req.originalUrl} `, 404));
});

app.use(Erorr);

module.exports = app;
