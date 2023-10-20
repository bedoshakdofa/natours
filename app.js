//core module
const express = require('express');
const morgan = require('morgan');
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
module.exports = app;
