const express = require('express');
const User = require('./../controller/Usercontroller');
const router = express.Router();

router
  .route('/')
  .get(User.GetAllUser)
  .post(User.CreateUser);

router
  .route('/:id')
  .patch(User.UpdateUser)
  .get(User.GetUser)
  .delete(User.DeleteUser);

module.exports = router;
