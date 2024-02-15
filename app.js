//core module
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
//my modules
const AppError = require('./utlis/APPErorr');
const tourRouter = require('./routers/TourRouters');
const userRouter = require('./routers/UserRouter');
const reviewRouter = require('./routers/ReviewRouters');
const viewsRouter = require('./routers/viewsRoutes');
const Erorr = require('./controller/Errorcontroller');
//express
const app = express();

//Reading static, template files
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Body parser
app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

//Routes

app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find this ${req.originalUrl} `, 404));
});

app.use(Erorr);

module.exports = app;
