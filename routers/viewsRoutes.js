const express = require('express');
const Router = express.Router();
const views = require('./../controller/viewsControllers');
const Auth = require('./../controller/authController');

Router.use(Auth.isLoggedIn);
Router.get('/', views.getOverview);
Router.get('/tour/:slug', views.getTourView);
Router.get('/login', views.getLoginview);
Router.get('/signup', views.getsginup);
module.exports = Router;
