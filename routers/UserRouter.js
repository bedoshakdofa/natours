const express = require('express');
const User = require('./../controller/Usercontroller');
const auth = require('./../controller/authController');
const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.route('/').get(User.GetAllUser).post(User.CreateUser);

router
  .route('/:id')
  .patch(User.UpdateUser)
  .get(User.GetUser)
  .delete(User.DeleteUser);

module.exports = router;
